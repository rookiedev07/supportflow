import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTicketById, updateTicket } from '../services/ticketService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { SkeletonDetails } from '../components/common/SkeletonLoader';
import { CATEGORIES, PRIORITIES } from '../utils/constants';
import { ArrowLeft, Save } from 'lucide-react';

export const EditTicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: ''
  });
  const [ticket, setTicket] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setIsLoading(true);
        const res = await getTicketById(id);
        const t = res.data.ticket;
        setTicket(t);

        if (user?.role === 'CUSTOMER' && t.status !== 'OPEN') {
          error('Customer tickets can only be edited while in OPEN status', 'Permission Denied');
          navigate(`/tickets/${id}`);
          return;
        }

        setFormData({
          title: t.title,
          description: t.description,
          category: t.category,
          priority: t.priority
        });
      } catch (err) {
        error(err.response?.data?.message || 'Failed to load ticket for editing');
        navigate('/tickets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicket();
  }, [id, user?.role, navigate, error]);

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
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await updateTicket(id, formData);
      success('Ticket updated successfully', 'Saved');
      navigate(`/tickets/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update ticket';
      error(msg, 'Update Error');
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <SkeletonDetails />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-surface-border/60">
        <Link
          to={`/tickets/${id}`}
          className="p-1.5 rounded-lg border border-surface-border hover:bg-surface-hover text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Edit Ticket {ticket?.ticketNumber}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify ticket parameters and incident details
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
            error={errors.title}
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
              className={`block w-full rounded-lg bg-surface-100 border text-slate-100 placeholder-slate-500 text-xs p-3.5 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors leading-relaxed ${
                errors.description ? 'border-rose-500' : 'border-surface-border'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="pt-4 border-t border-surface-border flex items-center justify-end gap-3">
            <Link to={`/tickets/${id}`}>
              <Button variant="secondary" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              isLoading={isSubmitting}
              icon={Save}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
