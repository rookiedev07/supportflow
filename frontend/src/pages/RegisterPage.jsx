import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { Layers, Mail, Lock, User, UserPlus } from 'lucide-react';
import { ROLES } from '../utils/constants';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.CUSTOMER
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
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email address is required';
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      await register(formData);
      success('Account created successfully', 'Welcome to SupportFlow');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      error(msg, 'Account Creation Error');
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
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
          Create your account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Get started with enterprise support management
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-surface-card border border-surface-border py-8 px-6 shadow-xl rounded-2xl sm:px-8 space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              name="name"
              icon={User}
              placeholder="Elena Rostova"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              icon={Mail}
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              icon={Lock}
              placeholder="Minimum 8 characters with letter & number"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              helperText="Must be at least 8 characters with a letter and a number"
            />

            <Select
              label="Account Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: ROLES.CUSTOMER, label: 'Customer (Submit & track tickets)' },
                { value: ROLES.AGENT, label: 'Support Agent (Manage & resolve tickets)' },
                { value: ROLES.ADMIN, label: 'System Administrator (Full access)' }
              ]}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              icon={UserPlus}
            >
              Create Account
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-surface-border">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
