import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 7);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`block w-full rounded-lg bg-surface-card border text-slate-100 placeholder-slate-500 text-sm py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 disabled:bg-surface-300 ${
              Icon ? 'pl-9' : 'pl-3.5'
            } pr-3.5 ${
              error
                ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                : 'border-surface-border'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
