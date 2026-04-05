import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg p-8 w-full max-w-md">
        <h1 className="font-heading font-extrabold text-2xl mb-6 text-center">
          Mayor<span className="text-primary">Tech</span> Admin
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Enter Admin Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface2 border border-border rounded-[10px] text-foreground font-body text-sm py-[11px] px-3.5 outline-none focus:border-primary placeholder:text-muted"
              placeholder="Password"
              required
            />
          </div>
          {error && (
            <div className="text-destructive text-sm text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm cursor-pointer hover:brightness-90"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}