import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const ForbiddenPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-xl">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight">403</h1>
      <h2 className="text-base font-semibold text-slate-300 mt-1">Access Restricted</h2>
      <p className="text-xs text-slate-400 max-w-sm mt-2 mb-6">
        Your current user role lacks the security permissions required to view this resource.
      </p>
      <Link to="/">
        <Button size="sm" icon={ArrowLeft}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
