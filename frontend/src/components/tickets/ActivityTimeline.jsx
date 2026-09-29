import React from 'react';
import { formatRelativeTime } from '../../utils/constants';
import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  Tag,
  UserCheck,
  MessageSquare,
  FileEdit
} from 'lucide-react';

const ACTION_CONFIG = {
  TICKET_CREATED: {
    icon: Sparkles,
    color: 'text-brand-400 bg-brand-500/10 border-brand-500/30'
  },
  STATUS_CHANGED: {
    icon: RefreshCw,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
  },
  PRIORITY_CHANGED: {
    icon: AlertCircle,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  CATEGORY_CHANGED: {
    icon: Tag,
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/30'
  },
  TICKET_ASSIGNED: {
    icon: UserCheck,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
  },
  COMMENT_ADDED: {
    icon: MessageSquare,
    color: 'text-slate-400 bg-surface-50 border-surface-border'
  },
  TICKET_UPDATED: {
    icon: FileEdit,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  }
};

export const ActivityTimeline = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-500">
        No recorded activity yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-surface-border">
      {activities.map((act) => {
        const config = ACTION_CONFIG[act.action] || ACTION_CONFIG.TICKET_UPDATED;
        const IconComponent = config.icon;

        return (
          <div key={act._id} className="relative flex items-start gap-3">
            <div
              className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center ${config.color}`}
            >
              <IconComponent className="w-2.5 h-2.5" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-300">
                <span className="font-semibold text-slate-100">
                  {act.performedBy?.name || 'System'}
                </span>{' '}
                <span className="text-slate-400">
                  {act.details || act.action.replace(/_/g, ' ').toLowerCase()}
                </span>
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {formatRelativeTime(act.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
