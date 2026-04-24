import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Headphones, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLogin } from '../hooks/useAuth';
import { loginSchema } from '@helpdesk/shared';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (authLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        fieldErrors[err.path.join('.')] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    loginMutation.mutate(parsed.data, {
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <div className="public-layout">
      <div className="public-container animate-slide-up" style={{ maxWidth: '420px' }}>
        <div className="public-header">
          <div className="public-header-logo"><Headphones size={28} /></div>
          <h1>Agent Login</h1>
          <p>Sign in to access the helpdesk dashboard.</p>
        </div>

        <div className="public-card">
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email</label>
                <input id="login-email" type="email" className="form-input" placeholder="agent@xriseai.com" value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); }} autoComplete="email" />
                <span className="form-error">{errors.email}</span>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <input id="login-password" type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: '' })); }} autoComplete="current-password" />
                <span className="form-error">{errors.password}</span>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loginMutation.isPending} style={{ width: '100%', marginTop: '4px' }}>
                {loginMutation.isPending ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
              </button>
            </div>
          </form>
        </div>

        <div className="public-footer">
          <Link to="/">Submit a ticket</Link>
          <span style={{ margin: '0 12px', color: 'var(--text-muted)' }}>·</span>
          <Link to="/status">Check ticket status</Link>
        </div>
      </div>
    </div>
  );
};
