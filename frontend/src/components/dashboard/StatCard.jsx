import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default'
}) => {
  const variantStyles = {
    default: {
      border: 'border-surface-border',
      iconBg: 'bg-surface-50 text-slate-300'
    },
    primary: {
      border: 'border-brand-500/30',
      iconBg: 'bg-brand-500/10 text-brand-400'
    },
    success: {
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/10 text-emerald-400'
    },
    warning: {
      border: 'border-amber-500/30',
      iconBg: 'bg-amber-500/10 text-amber-400'
    },
    danger: {
      border: 'border-rose-500/30',
      iconBg: 'bg-rose-500/10 text-rose-400'
    },
    sky: {
      border: 'border-sky-500/30',
      iconBg: 'bg-sky-500/10 text-sky-400'
    }
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className={`p-5 rounded-xl bg-surface-card border ${style.border} transition-all duration-150 hover:bg-surface-hover/50`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-white tracking-tight mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg border border-surface-border/50 shrink-0 ${style.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
