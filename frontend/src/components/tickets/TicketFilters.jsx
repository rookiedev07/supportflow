import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { STATUSES, PRIORITIES, CATEGORIES } from '../../utils/constants';

export const TicketFilters = ({ filters, onFilterChange, onReset }) => {
  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.priority ||
    filters.category ||
    filters.sortBy !== 'createdAt' ||
    filters.order !== 'desc';

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tickets by ID, title, or keywords..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-surface-100 border border-surface-border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="text-xs bg-surface-100 border border-surface-border rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">All Statuses</option>
            {Object.values(STATUSES).map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          <select
            value={filters.priority || ''}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="text-xs bg-surface-100 border border-surface-border rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">All Priorities</option>
            {Object.values(PRIORITIES).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="text-xs bg-surface-100 border border-surface-border rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">All Categories</option>
            {Object.values(CATEGORIES).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={`${filters.sortBy || 'createdAt'}-${filters.order || 'desc'}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split('-');
              onFilterChange('sortBy', sortBy);
              onFilterChange('order', order);
            }}
            className="text-xs bg-surface-100 border border-surface-border rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="updatedAt-desc">Recently Updated</option>
            <option value="priority-desc">Priority</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-surface-hover/80 rounded-lg border border-surface-border transition-colors shrink-0"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
