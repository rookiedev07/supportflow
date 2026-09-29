import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Layers, Mail, Lock, ArrowRight, Shield, User, Headphones } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const errors = {};
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      await login(formData.email, formData.password);
      success('Logged in successfully', 'Welcome back');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      error(msg, 'Authentication Failed');
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SupportFlow</span>
        </div>

        <h2 className="text-center text-xl font-bold text-white tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Enterprise support and ticket management platform
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-surface-card border border-surface-border py-8 px-6 shadow-xl rounded-2xl sm:px-8 space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              icon={Mail}
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              icon={Lock}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              icon={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          <div className="pt-4 border-t border-surface-border">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2.5 text-center">
              Quick Demo Accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@supportflow.dev', 'Password123!')}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface-100 hover:bg-surface-hover border border-surface-border text-center transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[11px] font-semibold text-slate-200">Admin</span>
                <span className="text-[9px] text-slate-500">Marcus</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sarah.chen@supportflow.dev', 'Password123!')}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface-100 hover:bg-surface-hover border border-surface-border text-center transition-colors"
              >
                <Headphones className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] font-semibold text-slate-200">Agent</span>
                <span className="text-[9px] text-slate-500">Sarah</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('david.kim@fintechlabs.com', 'Password123!')}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface-100 hover:bg-surface-hover border border-surface-border text-center transition-colors"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold text-slate-200">Customer</span>
                <span className="text-[9px] text-slate-500">David</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Need an account?{' '}
              <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
