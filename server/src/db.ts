import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB
// In production (Render/Railway), data might be ephemeral unless using a volume.
// For persistent production data, switch to PostgreSQL.
const dbPath = path.resolve(__dirname, '../data.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

export const initDB = () => {
  // 1. Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      feishu_open_id TEXT PRIMARY KEY,
      name TEXT,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Attempts table (Tracks a full game session)
  db.exec(`
    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT,
      start_time INTEGER,
      end_time INTEGER,
      score INTEGER DEFAULT 0,
      is_winner BOOLEAN DEFAULT 0,
      verification_code TEXT,
      FOREIGN KEY(user_id) REFERENCES users(feishu_open_id)
    )
  `);

  // 3. Answers table (Tracks individual question answers)
  db.exec(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id TEXT,
      question_id INTEGER,
      choice TEXT,
      is_correct BOOLEAN,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(attempt_id) REFERENCES attempts(id)
    )
  `);
};

export default db;