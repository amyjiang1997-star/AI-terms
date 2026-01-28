
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

interface Result {
  id: string;
  email: string;
  duration_ms: number;
  completed: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/results', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setIsAuthenticated(true);
      } else {
        setError('Unauthorized');
      }
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    window.location.href = `/api/admin/results.csv?token=${password}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-slate-200">
          <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Game Results</h1>
          <div className="flex gap-4">
             <button 
              onClick={() => window.location.reload()}
              className="bg-white text-slate-600 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 font-medium"
            >
              Refresh
            </button>
            <button 
              onClick={downloadCsv}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 shadow-sm"
            >
              Download CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Email</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Duration</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Date</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-800 font-medium">{row.email}</td>
                    <td className="p-4 font-mono text-blue-600">{(row.duration_ms / 1000).toFixed(2)}s</td>
                    <td className="p-4 text-slate-500 text-sm">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="p-4">
                      {row.completed ? 
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span> : 
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      }
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      No results found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminDashboard />
  </React.StrictMode>
);
