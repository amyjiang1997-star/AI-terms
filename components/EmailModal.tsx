
import React, { useState } from 'react';
import { Button } from './Button';

interface EmailModalProps {
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
}

export const EmailModal: React.FC<EmailModalProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    try {
      await onSubmit(email);
    } catch (err: any) {
      setError(err.message || '发生错误，请重试');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-pop border-4 border-blue-100">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          请填写你的工作邮箱
        </h2>
        <p className="text-center text-slate-500 mb-6 text-sm">
          以便答题中奖后的奖品寄送，如果你超厉害的话！
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
              disabled={isLoading}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 font-medium ml-1">
                {error}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            fullWidth 
            variant="primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Checking...' : '确认，开启游戏'}
          </Button>
        </form>
      </div>
    </div>
  );
};
