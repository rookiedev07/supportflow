import React from 'react';

const STATUS_DETAILS = [
  { key: 'OPEN', label: 'Open', color: 'bg-sky-500', text: 'text-sky-400' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'bg-indigo-500', text: 'text-indigo-400' },
  { key: 'WAITING_FOR_CUSTOMER', label: 'Waiting for Customer', color: 'bg-amber-500', text: 'text-amber-400' },
  { key: 'RESOLVED', label: 'Resolved', color: 'bg-emerald-500', text: 'text-emerald-400' },
  { key: 'CLOSED', label: 'Closed', color: 'bg-slate-500', text: 'text-slate-400' }
];

export const StatusDistribution = ({ distribution = {} }) => {
  const total = Object.values(distribution).reduce((sum, val) => sum + (val || 0), 0) || 1;

  return (
    <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white tracking-tight">Status Distribution</h3>
        <span className="text-xs text-slate-400 font-mono">{total} Total</span>
      </div>

      <div className="h-3 w-full bg-surface-100 rounded-full overflow-hidden flex">
        {STATUS_DETAILS.map((status) => {
          const count = distribution[status.key] || 0;
          const percentage = (count / total) * 100;
          if (percentage === 0) return null;

          return (
            <div
              key={status.key}
              style={{ width: `${percentage}%` }}
              className={`${status.color} transition-all duration-300`}
              title={`${status.label}: ${count} (${Math.round(percentage)}%)`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
        {STATUS_DETAILS.map((status) => {
          const count = distribution[status.key] || 0;
          const percentage = Math.round((count / total) * 100);

          return (
            <div key={status.key} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.color} shrink-0`} />
              <div className="min-w-0">
                <p className="text-xs text-slate-300 truncate">{status.label}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {count} <span className="text-[10px]">({percentage}%)</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
