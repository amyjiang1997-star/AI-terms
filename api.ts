// Simple fetch wrapper to handle API calls
// Supports environment variable for API base in production
// We use optional chaining for import.meta.env to prevent crashes if it's undefined in some environments
// Cast import.meta to any to avoid type errors if vite types are missing
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

const getHeaders = () => {
  return {
    'Content-Type': 'application/json'
  };
};

// Use 'credentials: include' to ensure HttpOnly cookies are sent
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: 'include',
  });
  return res;
};

export const api = {
  getMe: async () => {
    try {
      const res = await fetchWithAuth('/api/me');
      if (res.status === 401) return null;
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  loginFeishu: () => {
    // Redirect to backend login handler
    window.location.href = `${API_BASE}/auth/feishu/login`;
  },

  startAttempt: async () => {
    const res = await fetchWithAuth('/api/startAttempt', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to start attempt');
    return await res.json(); // returns { attemptId }
  },

  submitAnswer: async (attemptId: string, questionId: number, choice: string) => {
    const res = await fetchWithAuth('/api/submitAnswer', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ attemptId, questionId, choice })
    });
    if (!res.ok) throw new Error('Failed to submit answer');
    return await res.json(); // returns { correct, learningCard }
  },

  finishAttempt: async (attemptId: string) => {
    const res = await fetchWithAuth('/api/finishAttempt', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ attemptId })
    });
    if (!res.ok) throw new Error('Failed to finish attempt');
    return await res.json(); // returns { score, verificationCode, etc }
  }
};