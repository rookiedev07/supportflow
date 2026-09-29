import React from 'react';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/constants';
import { Activity as ActivityIcon } from 'lucide-react';

export const RecentActivityList = ({ activities = [] }) => {
  return (
    <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
          <ActivityIcon className="w-4 h-4 text-brand-400" />
          Recent Activity
        </h3>
        <span className="text-xs text-slate-400">Real-time Stream</span>
      </div>

      {activities.length === 0 ? (
        <p className="text-xs text-slate-500 py-6 text-center">No recorded system events yet</p>
      ) : (
        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act._id}
              className="flex items-start justify-between gap-3 text-xs border-b border-surface-border/60 pb-2.5 last:border-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-slate-200">
                  <span className="font-medium text-white">{act.performedBy?.name || 'User'}</span>{' '}
                  <span className="text-slate-400">{act.details || act.action}</span>
                </p>
                {act.ticket && (
                  <Link
                    to={`/tickets/${act.ticket._id}`}
                    className="text-[11px] font-mono text-brand-400 hover:text-brand-300 transition-colors inline-block mt-0.5"
                  >
                    {act.ticket.ticketNumber || 'Ticket'} — {act.ticket.title}
                  </Link>
                )}
              </div>
              <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                {formatRelativeTime(act.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
