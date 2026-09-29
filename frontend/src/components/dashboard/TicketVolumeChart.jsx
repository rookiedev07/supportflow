import React from 'react';

export const TicketVolumeChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-5 rounded-xl bg-surface-card border border-surface-border">
        <h3 className="text-sm font-semibold text-white tracking-tight mb-2">Ticket Inflow</h3>
        <p className="text-xs text-slate-500 py-8 text-center">No volume trends recorded yet</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 5);

  return (
    <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white tracking-tight">Recent Ticket Inflow</h3>
        <span className="text-xs text-slate-400">Past 14 Days</span>
      </div>

      <div className="h-44 flex items-end gap-2 pt-6 pb-2 px-1">
        {data.map((item) => {
          const heightPercent = Math.max(10, Math.round((item.count / maxCount) * 100));
          const dateLabel = item._id ? item._id.split('-').slice(1).join('/') : '';

          return (
            <div
              key={item._id}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
            >
              <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.count}
              </span>
              <div
                style={{ height: `${heightPercent}%` }}
                className="w-full bg-brand-500/30 group-hover:bg-brand-500 rounded-t-sm transition-all duration-200 border-t border-brand-400"
                title={`${item._id}: ${item.count} tickets`}
              />
              <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap">
                {dateLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
