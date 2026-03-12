import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { FormField } from '../components/FormField';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../context/store';
import { ThemeToggle } from '../components/ThemeToggle';

export function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const { mutate: login, isPending } = useLogin();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    login(formData, {
      onSuccess: (data) => {
        setUser(data.user);
        setToken(data.token);
        navigate('/dashboard');
      },
      onError: (error: any) => {
        console.error('Login error:', error);
        const message = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Login failed. Please try again.';
        setGeneralError(message);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            <h1 className="text-2xl font-bold gradient-text">Notes</h1>
          </div>
          <ThemeToggle />
        </div>

        <div className="glass-lg rounded-2xl p-8 border-2">
          <h2 className="text-2xl font-bold mb-2 text-white">Welcome Back</h2>
          <p className="text-slate-300 mb-6">
            Sign in to your account to continue
          </p>

          {generalError && (
            <div className="mb-4 p-4 bg-red-500/30 border border-red-500/60 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-300 flex-shrink-0 mt-0.5" />
              <p className="text-red-200">{generalError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              placeholder="you@example.com"
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              placeholder="••••••••"
            />

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-primary-600/20 rounded-lg border border-primary-500/50">
            <p className="text-sm text-primary-200">
              <strong>Demo Credentials:</strong><br/>
              Email: demo@example.com<br/>
              Password: demo@123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
