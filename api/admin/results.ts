
import { supabase } from '../_lib/supabase.js';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data, error } = await supabase
      .from('game_results')
      .select('*')
      .order('duration_ms', { ascending: true });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
