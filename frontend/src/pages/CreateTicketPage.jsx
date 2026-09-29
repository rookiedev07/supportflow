import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTicket } from '../services/ticketService';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { CATEGORIES, PRIORITIES } from '../utils/constants';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';

export const CreateTicketPage = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES.GENERAL,
    priority: PRIORITIES.MEDIUM
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.trim().length > 150) {
      newErrors.title = 'Title cannot exceed 150 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createTicket(formData);
      success('Support ticket created successfully', 'Ticket Created');
      navigate(`/tickets/${res.data.ticket._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create ticket';
      error(msg, 'Submission Error');
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-surface-border/60">
        <Link
          to="/tickets"
          className="p-1.5 rounded-lg border border-surface-border hover:bg-surface-hover text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Create Support Ticket</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit a new technical, billing, or security ticket to our team
          </p>
        </div>
      </div>

      <div className="bg-surface-card border border-surface-border rounded-xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Ticket Subject"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Stripe webhook signature verification failure on recurring renewals"
            error={errors.title}
            helperText="Provide a concise, descriptive summary of the incident or request (3 - 150 characters)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Incident Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={Object.values(CATEGORIES).map((c) => ({ value: c, label: c }))}
              error={errors.category}
            />

            <Select
              label="Severity / Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={Object.values(PRIORITIES).map((p) => ({ value: p, label: p }))}
              error={errors.priority}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Detailed Description
            </label>
            <textarea
              name="description"
              rows={7}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what occurred, steps to reproduce, expected vs actual behavior, and relevant error messages..."
              className={`block w-full rounded-lg bg-surface-100 border text-slate-100 placeholder-slate-500 text-xs p-3.5 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors leading-relaxed ${
                errors.description ? 'border-rose-500' : 'border-surface-border'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">{errors.description}</p>
            )}
            <p className="text-[11px] text-slate-500">
              Be as specific as possible to expedite diagnosis and triage.
            </p>
          </div>

          <div className="pt-4 border-t border-surface-border flex items-center justify-end gap-3">
            <Link to="/tickets">
              <Button variant="secondary" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              isLoading={isSubmitting}
              icon={Send}
            >
              Submit Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
