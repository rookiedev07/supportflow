import React from 'react';
import { ArrowUp, ArrowDown, Minus, Flame } from 'lucide-react';

const PRIORITY_CONFIG = {
  Low: {
    label: 'Low',
    icon: ArrowDown,
    containerClass: 'text-slate-400 bg-slate-800/60 border-slate-700/60'
  },
  Medium: {
    label: 'Medium',
    icon: Minus,
    containerClass: 'text-sky-300 bg-sky-500/10 border-sky-500/25'
  },
  High: {
    label: 'High',
    icon: ArrowUp,
    containerClass: 'text-amber-300 bg-amber-500/10 border-amber-500/25'
  },
  Critical: {
    label: 'Critical',
    icon: Flame,
    containerClass: 'text-rose-300 bg-rose-500/10 border-rose-500/30 font-semibold'
  }
};

export const PriorityBadge = ({ priority, size = 'sm' }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;
  const IconComponent = config.icon;

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border whitespace-nowrap ${sizeClasses[size]} ${config.containerClass}`}
    >
      <IconComponent className="w-3 h-3 shrink-0" />
      {config.label}
    </span>
  );
};
