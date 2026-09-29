import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      className = '',
      id,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name || Math.random().toString(36).substring(2, 7);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`appearance-none block w-full rounded-lg bg-surface-card border text-slate-100 text-sm py-2 pl-3.5 pr-9 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 ${
              error
                ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                : 'border-surface-border'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface-100 text-slate-200">
                {opt.label}
              </option>
            ))}
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
