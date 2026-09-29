import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-9',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-11'
  };

  const variantStyles = {
    primary:
      'bg-brand-600 hover:bg-brand-500 text-white focus:ring-brand-500 shadow-sm shadow-brand-600/20',
    secondary:
      'bg-surface-50 hover:bg-surface-hover text-slate-200 border border-surface-border focus:ring-slate-500',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500 shadow-sm shadow-rose-600/20',
    outline:
      'border border-surface-border hover:bg-surface-hover text-slate-300 hover:text-white focus:ring-slate-500',
    ghost:
      'hover:bg-surface-hover text-slate-400 hover:text-white focus:ring-slate-500'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
    </button>
  );
};
