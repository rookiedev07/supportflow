import React from 'react';
import { Menu, Plus, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';

export const Header = ({ onOpenSidebar, title, subtitle, actions }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-surface-border bg-surface-card/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg border border-surface-border hover:bg-surface-hover"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          {title && <h1 className="text-base font-semibold text-white tracking-tight">{title}</h1>}
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actions}
        {user && user.role !== 'AGENT' && (
          <Link to="/tickets/new">
            <Button size="sm" icon={Plus}>
              <span className="hidden sm:inline">New Ticket</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        )}
        {user && (
          <Link
            to="/profile"
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-hover border border-surface-border/60 text-slate-300 hover:text-white transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-surface-50 border border-surface-subtle flex items-center justify-center text-xs font-semibold text-brand-400">
              {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
            </div>
            <span className="text-xs font-medium hidden md:inline">{user.name.split(' ')[0]}</span>
          </Link>
        )}
      </div>
    </header>
  );
};
