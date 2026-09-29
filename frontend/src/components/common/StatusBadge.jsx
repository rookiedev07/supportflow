import React from 'react';

const STATUS_CONFIG = {
  OPEN: {
    label: 'Open',
    dotClass: 'bg-sky-400',
    containerClass: 'bg-sky-500/10 text-sky-300 border-sky-500/25'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dotClass: 'bg-indigo-400 animate-pulse',
    containerClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25'
  },
  WAITING_FOR_CUSTOMER: {
    label: 'Waiting for Customer',
    dotClass: 'bg-amber-400',
    containerClass: 'bg-amber-500/10 text-amber-300 border-amber-500/25'
  },
  RESOLVED: {
    label: 'Resolved',
    dotClass: 'bg-emerald-400',
    containerClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
  },
  CLOSED: {
    label: 'Closed',
    dotClass: 'bg-slate-400',
    containerClass: 'bg-slate-800/80 text-slate-400 border-slate-700/50'
  }
};

export const StatusBadge = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.OPEN;

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border whitespace-nowrap ${sizeClasses[size]} ${config.containerClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`} />
      {config.label}
    </span>
  );
};
