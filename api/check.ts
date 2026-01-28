
import { supabase } from '../api/_lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const { data, error } = await supabase
      .from('game_results')
      .select('completed')
      .eq('email', email)
      .single();

    // PGRST116 means no rows returned, which is fine (not completed yet)
    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return res.status(200).json({ 
      email, 
      completed: data?.completed || false 
    });
  } catch (err) {
    console.error('Error checking status:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
