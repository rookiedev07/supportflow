import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center text-brand-400 mb-4 shadow-xl">
        <HelpCircle className="w-7 h-7" />
      </div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight">404</h1>
      <h2 className="text-base font-semibold text-slate-300 mt-1">Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm mt-2 mb-6">
        The resource or route you requested does not exist or has been relocated.
      </p>
      <Link to="/">
        <Button size="sm" icon={ArrowLeft}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
