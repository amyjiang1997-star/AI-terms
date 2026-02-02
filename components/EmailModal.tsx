
import React, { useState } from 'react';
import { Button } from './Button';

interface EmailModalProps {
  onSubmit: (nickname: string) => Promise<void>;
  isLoading: boolean;
}

export const EmailModal: React.FC<EmailModalProps> = ({ onSubmit, isLoading }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname.trim()) {
      setError('请输入你的昵称');
      return;
    }

    try {
      await onSubmit(nickname);
    } catch (err: any) {
      setError(err.message || '发生错误，请重试');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-pop border-4 border-blue-100">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          请填写你的独特昵称
        </h2>
        <p className="text-center text-slate-500 mb-6 text-sm">
          以便中奖后的开奖联系和奖品寄送，如果你超厉害的话！
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="请输入你的昵称"
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
