
import { supabase } from '../../api/_lib/supabase';

export default async function handler(req, res) {
    // For CSV download, we might use a query param token for simplicity
    const token = req.query.token;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || token !== adminPassword) {
         return res.status(401).send('Unauthorized');
    }

    try {
        const { data, error } = await supabase
          .from('game_results')
          .select('*')
          .order('created_at', { ascending: false });
    
        if (error) throw error;
    
        const csvHeader = 'id,email,duration_ms,completed,created_at\n';
        const csvRows = data?.map(row => 
            `${row.id},${row.email},${row.duration_ms},${row.completed},${row.created_at}`
        ).join('\n');
    
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="results.csv"');
        return res.status(200).send(csvHeader + csvRows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}
