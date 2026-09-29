import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Users,
  UserCheck,
  LogOut,
  Layers,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'AGENT':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['CUSTOMER', 'AGENT', 'ADMIN']
    },
    {
      to: '/tickets',
      label: 'All Tickets',
      icon: Ticket,
      roles: ['CUSTOMER', 'AGENT', 'ADMIN']
    },
    {
      to: '/tickets/new',
      label: 'Create Ticket',
      icon: PlusCircle,
      roles: ['CUSTOMER', 'ADMIN']
    },
    {
      to: '/users',
      label: 'User Directory',
      icon: Users,
      roles: ['ADMIN']
    },
    {
      to: '/profile',
      label: 'My Account',
      icon: UserCheck,
      roles: ['CUSTOMER', 'AGENT', 'ADMIN']
    }
  ];

  const filteredNavItems = navItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-surface-card border-r border-surface-border flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white shadow-sm shadow-brand-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">
                SupportFlow
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">
                Enterprise Desk
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {user && (
          <div className="px-5 py-3 border-b border-surface-border bg-surface-300/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Signed in as</span>
              <span
                className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full border ${getRoleBadge(
                  user.role
                )}`}
              >
                {user.role}
              </span>
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover border border-transparent'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {user && (
          <div className="p-3 border-t border-surface-border">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-100 border border-surface-border">
              <div className="w-8 h-8 rounded-full bg-surface-50 border border-surface-subtle flex items-center justify-center font-semibold text-xs text-brand-400 shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded hover:bg-surface-hover"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
