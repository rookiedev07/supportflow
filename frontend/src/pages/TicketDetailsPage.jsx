import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getTicketById,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
  getTicketComments,
  createTicketComment,
  getTicketActivity
} from '../services/ticketService';
import { getAssignees } from '../services/userService';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { SkeletonDetails } from '../components/common/SkeletonLoader';
import { CommentList } from '../components/tickets/CommentList';
import { CommentComposer } from '../components/tickets/CommentComposer';
import { ActivityTimeline } from '../components/tickets/ActivityTimeline';
import { formatDateTime, STATUSES } from '../utils/constants';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Shield,
  Trash2,
  Edit,
  CheckCircle,
  MessageSquare,
  Activity as ActivityIcon
} from 'lucide-react';

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [activeTab, setActiveTab] = useState('comments');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTicketData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [ticketRes, commentsRes, activityRes] = await Promise.all([
        getTicketById(id),
        getTicketComments(id),
        getTicketActivity(id)
      ]);

      setTicket(ticketRes.data.ticket);
      setComments(commentsRes.data.comments || []);
      setActivities(activityRes.data.activities || []);

      if (user?.role === 'ADMIN') {
        const assigneesRes = await getAssignees();
        setAssignees(assigneesRes.data.assignees || []);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        navigate('/forbidden');
      } else if (err.response?.status === 404) {
        navigate('/not-found');
      } else {
        error(err.response?.data?.message || 'Failed to load ticket details');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, user?.role, navigate, error]);

  useEffect(() => {
    fetchTicketData();
  }, [fetchTicketData]);

  const handleStatusChange = async (nextStatus) => {
    try {
      setIsUpdatingStatus(true);
      const res = await updateTicketStatus(id, nextStatus);
      setTicket(res.data.ticket);
      success(`Status transitioned to ${nextStatus.replace(/_/g, ' ')}`, 'Status Updated');
      const [commentsRes, activityRes] = await Promise.all([
        getTicketComments(id),
        getTicketActivity(id)
      ]);
      setComments(commentsRes.data.comments || []);
      setActivities(activityRes.data.activities || []);
    } catch (err) {
      error(err.response?.data?.message || 'Invalid status transition', 'Transition Error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAssignChange = async (newAssigneeId) => {
    try {
      setIsAssigning(true);
      const res = await assignTicket(id, newAssigneeId || null);
      setTicket(res.data.ticket);
      success('Ticket assignment updated', 'Success');
      const actRes = await getTicketActivity(id);
      setActivities(actRes.data.activities || []);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to assign ticket');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAddComment = async (message) => {
    try {
      setIsSubmittingComment(true);
      const res = await createTicketComment(id, message);
      setComments((prev) => [...prev, res.data.comment]);
      success('Comment posted', 'Success');
      const [ticketRes, actRes] = await Promise.all([
        getTicketById(id),
        getTicketActivity(id)
      ]);
      setTicket(ticketRes.data.ticket);
      setActivities(actRes.data.activities || []);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteTicket = async () => {
    try {
      setIsDeleting(true);
      await deleteTicket(id);
      success('Ticket deleted successfully');
      navigate('/tickets');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete ticket');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <SkeletonDetails />;
  }

  if (!ticket) {
    return null;
  }

  const allowedTransitions = {
    OPEN: ['IN_PROGRESS', 'CLOSED'],
    IN_PROGRESS: ['WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED'],
    WAITING_FOR_CUSTOMER: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    RESOLVED: ['CLOSED', 'IN_PROGRESS'],
    CLOSED: user?.role === 'ADMIN' ? ['OPEN'] : []
  };

  let validNextStatuses = allowedTransitions[ticket.status] || [];

  if (user?.role === 'CUSTOMER') {
    validNextStatuses = validNextStatuses.filter((s) => {
      if (ticket.status === 'OPEN' && s === 'CLOSED') return true;
      if (ticket.status === 'RESOLVED' && (s === 'CLOSED' || s === 'IN_PROGRESS')) return true;
      return false;
    });
  }

  const isAuthor = ticket.createdBy?._id === user?._id;
  const canEdit =
    user?.role === 'ADMIN' ||
    user?.role === 'AGENT' ||
    (user?.role === 'CUSTOMER' && isAuthor && ticket.status === 'OPEN');
  const canDelete = user?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-surface-border/60">
        <div className="flex items-center gap-3">
          <Link
            to="/tickets"
            className="p-1.5 rounded-lg border border-surface-border hover:bg-surface-hover text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                {ticket.ticketNumber}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} size="xs" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-1">
              {ticket.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Link to={`/tickets/${ticket._id}/edit`}>
              <Button size="sm" variant="secondary" icon={Edit}>
                Edit
              </Button>
            </Link>
          )}
          {canDelete && (
            <Button
              size="sm"
              variant="danger"
              icon={Trash2}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-card border border-surface-border rounded-xl p-6 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Ticket Description
            </h3>
            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-surface-100/60 p-4 rounded-lg border border-surface-border/60">
              {ticket.description}
            </div>
          </div>

          <div className="bg-surface-card border border-surface-border rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex items-center gap-1.5 text-xs font-semibold pb-1 border-b-2 transition-colors ${
                    activeTab === 'comments'
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Discussion ({comments.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('activity')}
                  className={`flex items-center gap-1.5 text-xs font-semibold pb-1 border-b-2 transition-colors ${
                    activeTab === 'activity'
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ActivityIcon className="w-3.5 h-3.5" />
                  <span>Audit Trail ({activities.length})</span>
                </button>
              </div>
            </div>

            {activeTab === 'comments' ? (
              <div className="space-y-6">
                <CommentList comments={comments} />
                <div className="pt-2">
                  <CommentComposer
                    onSubmit={handleAddComment}
                    isSubmitting={isSubmittingComment}
                    placeholder="Type your message or technical notes here..."
                  />
                </div>
              </div>
            ) : (
              <div className="py-2">
                <ActivityTimeline activities={activities} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-2 border-b border-surface-border">
              Ticket Controls
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 block">
                Workflow State
              </label>

              {validNextStatuses.length > 0 ? (
                <div className="space-y-2">
                  <select
                    disabled={isUpdatingStatus}
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full text-xs bg-surface-100 border border-surface-border rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                  >
                    <option value={ticket.status} disabled>
                      Current: {ticket.status.replace(/_/g, ' ')}
                    </option>
                    {validNextStatuses.map((st) => (
                      <option key={st} value={st}>
                        Transition to: {st.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500">
                    State transitions strictly follow configured support workflow rules.
                  </p>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-surface-100 border border-surface-border text-xs text-slate-400">
                  Ticket is in terminal or restricted status: <span className="font-semibold text-slate-200">{ticket.status}</span>
                </div>
              )}
            </div>

            {user?.role === 'ADMIN' && (
              <div className="space-y-2 pt-2 border-t border-surface-border">
                <label className="text-xs font-medium text-slate-300 block">
                  Assigned Support Agent
                </label>
                <select
                  disabled={isAssigning}
                  value={ticket.assignedTo?._id || ''}
                  onChange={(e) => handleAssignChange(e.target.value)}
                  className="w-full text-xs bg-surface-100 border border-surface-border rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                >
                  <option value="">Unassigned</option>
                  {assignees.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name} ({agent.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4 text-xs">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-2 border-b border-surface-border">
              Metadata & Attributes
            </h3>

            <div className="space-y-3 divide-y divide-surface-border/60">
              <div className="flex items-center justify-between pb-2">
                <span className="text-slate-400">Category</span>
                <Badge variant="default" size="sm">
                  {ticket.category}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400">Priority Level</span>
                <PriorityBadge priority={ticket.priority} size="xs" />
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400">Raised By</span>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{ticket.createdBy?.name || 'Customer'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400">Current Assignee</span>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  <span>{ticket.assignedTo?.name || 'Unassigned'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400">Created On</span>
                <span className="text-slate-300 font-mono text-[11px]">
                  {formatDateTime(ticket.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Last Modified</span>
                <span className="text-slate-300 font-mono text-[11px]">
                  {formatDateTime(ticket.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteTicket}
        title="Permanently Delete Ticket"
        message={`Are you sure you want to permanently delete ticket ${ticket.ticketNumber}? This will also delete all associated comments and audit trails. This action cannot be undone.`}
        confirmText="Delete Ticket"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};
