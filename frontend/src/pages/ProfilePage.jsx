import React from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../utils/constants';
import { Button } from '../components/common/Button';
import { User, Mail, Shield, Calendar, LogOut, CheckCircle2 } from 'lucide-react';

export const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-2 border-b border-surface-border/60">
        <h2 className="text-xl font-bold text-white tracking-tight">Account Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          View your authenticated profile and active session parameters
        </p>
      </div>

      <div className="bg-surface-card border border-surface-border rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-4 pb-6 border-b border-surface-border">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 border border-brand-400/30 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-brand-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-[11px] font-semibold tracking-wide uppercase">
              <Shield className="w-3 h-3" />
              {user?.role} Portal
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-surface-100 border border-surface-border/60 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              Email Address
            </span>
            <p className="text-sm font-semibold text-slate-200">{user?.email}</p>
          </div>

          <div className="p-4 rounded-lg bg-surface-100 border border-surface-border/60 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Account Status
            </span>
            <p className="text-sm font-semibold text-emerald-400">
              {user?.isActive ? 'Active & Verified' : 'Deactivated'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-100 border border-surface-border/60 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Member Since
            </span>
            <p className="text-sm font-semibold text-slate-200">
              {user?.createdAt ? formatDateTime(user.createdAt) : 'Registered user'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-100 border border-surface-border/60 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              Session Protection
            </span>
            <p className="text-sm font-semibold text-slate-200">JWT Bearer Authorization</p>
          </div>
        </div>

        <div className="pt-6 border-t border-surface-border flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Sign out of your active session on this device
          </p>
          <Button
            variant="danger"
            size="sm"
            icon={LogOut}
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
