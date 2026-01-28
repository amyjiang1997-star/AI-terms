
import { supabase } from './_lib/supabase.ts';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, duration_ms } = req.body;

  if (!email || typeof duration_ms !== 'number') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Basic validation: duration must be positive and less than 1 hour
  if (duration_ms <= 0 || duration_ms > 3600000) {
      return res.status(400).json({ error: 'Invalid duration' });
  }

  try {
    // 1. Check if already completed to prevent overwriting with better score if rules say "once only"
    // The requirement says: "If already completed, refuse to overwrite score (keep first score)"
    const { data: existing } = await supabase
      .from('game_results')
      .select('completed')
      .eq('email', email)
      .single();

    if (existing?.completed) {
      return res.status(200).json({ ok: false, reason: 'already_completed' });
    }

    // 2. Upsert (Insert or Update if exists but not completed)
    // We use upsert to handle cases where the user might have started but not finished (if we tracked starts),
    // but here we just upsert based on email.
    const { error } = await supabase
      .from('game_results')
      .upsert({ 
        email, 
        duration_ms, 
        completed: true,
        created_at: new Date().toISOString()
      }, { onConflict: 'email' });

    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error submitting result:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
