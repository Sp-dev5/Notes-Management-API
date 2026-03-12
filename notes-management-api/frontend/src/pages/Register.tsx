import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { FormField } from '../components/FormField';
import { useRegister } from '../hooks/useAuth';
import { useAuthStore } from '../context/store';
import { ThemeToggle } from '../components/ThemeToggle';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const { mutate: register, isPending } = useRegister();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    register(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: (data) => {
          setUser(data.user);
          setToken(data.token);
          navigate('/dashboard');
        },
        onError: (error: any) => {
          const message = error.response?.data?.error || 'Registration failed. Please try again.';
          setGeneralError(message);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
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
          <h2 className="text-2xl font-bold mb-2 text-white">Create Account</h2>
          <p className="text-slate-300 mb-6">
            Join us and start taking notes securely
          </p>

          {generalError && (
            <div className="mb-4 p-4 bg-red-500/30 border border-red-500/60 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-300 flex-shrink-0 mt-0.5" />
              <p className="text-red-200">{generalError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              placeholder="John Doe"
            />

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

            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              placeholder="••••••••"
            />

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isPending ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-300">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
