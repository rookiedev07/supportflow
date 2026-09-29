import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Badge } from '../common/Badge';
import { formatRelativeTime } from '../../utils/constants';
import { ChevronRight, User, Clock } from 'lucide-react';

export const TicketRow = ({ ticket }) => {
  return (
    <Link
      to={`/tickets/${ticket._id}`}
      className="group block bg-surface-card hover:bg-surface-hover/80 border border-surface-border rounded-xl transition-all duration-150 p-4 shadow-xs"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span className="font-mono text-xs font-semibold text-brand-400 bg-brand-500/10 px-2 py-1 rounded-md border border-brand-500/20 shrink-0">
            {ticket.ticketNumber || 'SF-TKT'}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-brand-300 transition-colors truncate">
                {ticket.title}
              </h3>
              <Badge size="sm" variant="default">
                {ticket.category}
              </Badge>
            </div>

            <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
              {ticket.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-surface-border/60 shrink-0">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={ticket.priority} size="xs" />
            <StatusBadge status={ticket.status} size="xs" />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="hidden sm:flex items-center gap-1.5 min-w-[120px]">
              <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">
                {ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}
              </span>
            </div>

            <div className="flex items-center gap-1 min-w-[70px] text-right justify-end text-slate-500">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{formatRelativeTime(ticket.createdAt)}</span>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
};
