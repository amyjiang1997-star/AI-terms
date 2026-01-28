import express from 'express';
import cookieSession from 'cookie-session';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Parser } from 'json2csv';
import db, { initDB } from './db';
import { QUESTIONS_SOURCE } from './questions';

dotenv.config();
initDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Cast middleware to any to avoid type mismatch with Express RequestHandler
app.use(express.json() as any);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true // Allow cookies to be sent from frontend
}));

// Session (HttpOnly Cookie)
// We use this to persist the Feishu user ID securely
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'default_secret'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Secure in production
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Cross-site needed if frontend/backend on diff domains
}) as any);

// ------------------------------------------------------------------
// AUTH ROUTES (Feishu)
// ------------------------------------------------------------------

const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

app.get('/auth/feishu/login', (req, res) => {
  if (!FEISHU_APP_ID || !CALLBACK_URL) {
    return res.status(500).send('Server misconfigured (Missing Feishu Env)');
  }
  const redirectUri = encodeURIComponent(CALLBACK_URL);
  // Using Feishu V3 OAuth
  const url = `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${FEISHU_APP_ID}&redirect_uri=${redirectUri}&response_type=code&state=init`;
  res.redirect(url);
});

app.get('/auth/feishu/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('No code returned');

  try {
    // 1. Get app_access_token (internal)
    const tokenUrl = 'https://passport.feishu.cn/suite/passport/oauth/token';
    const tokenRes = await axios.post(tokenUrl, {
      grant_type: 'authorization_code',
      client_id: FEISHU_APP_ID,
      client_secret: FEISHU_APP_SECRET,
      code: code,
      redirect_uri: CALLBACK_URL
    });

    const accessToken = tokenRes.data.access_token;

    // 2. Get User Info
    const userRes = await axios.get('https://passport.feishu.cn/suite/passport/oauth/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const feishuUser = userRes.data; // { open_id, name, avatar_url, ... }

    // 3. Upsert User in DB
    const stmt = db.prepare(`
      INSERT INTO users (feishu_open_id, name, avatar_url) 
      VALUES (?, ?, ?) 
      ON CONFLICT(feishu_open_id) DO UPDATE SET name=excluded.name, avatar_url=excluded.avatar_url
    `);
    stmt.run(feishuUser.open_id, feishuUser.name, feishuUser.avatar_url);

    // 4. Set Session
    (req as any).session.user = {
      open_id: feishuUser.open_id,
      name: feishuUser.name,
      avatar_url: feishuUser.avatar_url
    };

    // 5. Redirect back to frontend
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');

  } catch (error: any) {
    console.error('Auth Error:', error.response?.data || error.message);
    res.status(500).send('Authentication Failed');
  }
});

// ------------------------------------------------------------------
// API ROUTES
// ------------------------------------------------------------------

// Middleware: Require Login
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!(req as any).session?.user) {
    return (res as any).status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// GET /api/me
app.get('/api/me', (req, res) => {
  const user = (req as any).session?.user;
  if (user) {
    res.json({
      feishu_open_id: user.open_id,
      name: user.name,
      avatar_url: user.avatar_url
    });
  } else {
    res.status(401).json(null);
  }
});

// POST /api/startAttempt
app.post('/api/startAttempt', requireAuth, (req, res) => {
  const user = (req as any).session.user;
  const attemptId = uuidv4();
  
  try {
    const stmt = db.prepare('INSERT INTO attempts (id, user_id, user_name, start_time) VALUES (?, ?, ?, ?)');
    stmt.run(attemptId, user.open_id, user.name, Date.now());
    res.json({ attemptId });
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/submitAnswer
app.post('/api/submitAnswer', requireAuth, (req, res) => {
  const { attemptId, questionId, choice } = req.body;
  if (!attemptId || !questionId) return res.status(400).json({ error: 'Missing fields' });

  const question = QUESTIONS_SOURCE.find(q => q.id === questionId);
  if (!question) return res.status(404).json({ error: 'Question not found' });

  const isCorrect = choice === question.correct_key;

  try {
    const stmt = db.prepare('INSERT INTO answers (attempt_id, question_id, choice, is_correct) VALUES (?, ?, ?, ?)');
    stmt.run(attemptId, questionId, choice, isCorrect ? 1 : 0);

    // If wrong, or correct, we return the "Learning Card" data
    res.json({
      correct: isCorrect,
      learningCard: {
        term: question.term,
        memory: question.memory,
        example: question.example,
        example_cn: question.example_cn
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to record answer' });
  }
});

// POST /api/finishAttempt
app.post('/api/finishAttempt', requireAuth, (req, res) => {
  const { attemptId } = req.body;
  const user = (req as any).session.user;

  try {
    // 1. Calculate Score based on DB records (Secure)
    const answers = db.prepare('SELECT is_correct FROM answers WHERE attempt_id = ?').all(attemptId) as {is_correct: number}[];
    const score = answers.filter(a => a.is_correct === 1).length;
    const isWinner = score === 10;
    const endTime = Date.now();

    // 2. Get Start Time to calculate duration
    const attempt = db.prepare('SELECT start_time FROM attempts WHERE id = ?').get(attemptId) as {start_time: number};
    const durationMs = attempt ? (endTime - attempt.start_time) : 0;

    // 3. Generate Code if Winner
    let verificationCode = null;
    if (isWinner) {
      // Simple signature: WIN-{timestamp}-{random}
      verificationCode = `WIN-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random()*9999)}`;
    }

    // 4. Update Attempt
    const updateStmt = db.prepare(`
      UPDATE attempts 
      SET end_time = ?, score = ?, is_winner = ?, verification_code = ?
      WHERE id = ?
    `);
    updateStmt.run(endTime, score, isWinner ? 1 : 0, verificationCode, attemptId);

    res.json({
      score,
      duration_ms: durationMs,
      is_winner: isWinner,
      verification_code: verificationCode
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to finish attempt' });
  }
});

// GET /api/winners.csv (Export)
app.get('/api/winners.csv', (req, res) => {
  // Simple protection: Check for a query param secret or just require login
  // For now, requiring login is enough for internal tools
  if (!(req as any).session?.user) return res.status(401).send('Unauthorized');

  try {
    const winners = db.prepare(`
      SELECT user_name, user_id, score, verification_code, 
             datetime(end_time/1000, 'unixepoch') as finished_at_utc 
      FROM attempts 
      WHERE is_winner = 1 
      ORDER BY end_time DESC
    `).all();

    const parser = new Parser();
    const csv = parser.parse(winners);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('winners.csv');
    res.send(csv);
  } catch (e) {
    res.status(500).send('Error generating CSV');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});