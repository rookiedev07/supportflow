import React from 'react';

const PRIORITIES_ORDER = [
  { key: 'Critical', color: 'bg-rose-500', barBg: 'bg-rose-500/20' },
  { key: 'High', color: 'bg-amber-500', barBg: 'bg-amber-500/20' },
  { key: 'Medium', color: 'bg-sky-500', barBg: 'bg-sky-500/20' },
  { key: 'Low', color: 'bg-slate-400', barBg: 'bg-slate-700/40' }
];

export const PriorityDistribution = ({ distribution = {} }) => {
  const total = Object.values(distribution).reduce((sum, val) => sum + (val || 0), 0) || 1;

  return (
    <div className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4">
      <h3 className="text-sm font-semibold text-white tracking-tight">Priority Breakdown</h3>

      <div className="space-y-3">
        {PRIORITIES_ORDER.map((item) => {
          const count = distribution[item.key] || 0;
          const percentage = Math.round((count / total) * 100);

          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">{item.key}</span>
                <span className="text-slate-400 font-mono">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className={`h-2 w-full ${item.barBg} rounded-full overflow-hidden`}>
                <div
                  style={{ width: `${percentage}%` }}
                  className={`h-full ${item.color} rounded-full transition-all duration-300`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
