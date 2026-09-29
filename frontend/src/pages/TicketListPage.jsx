import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTickets } from '../services/ticketService';
import { TicketFilters } from '../components/tickets/TicketFilters';
import { TicketRow } from '../components/tickets/TicketRow';
import { Pagination } from '../components/common/Pagination';
import { SkeletonRow } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Plus, Ticket as TicketIcon } from 'lucide-react';
import { STATUSES } from '../utils/constants';

export const TicketListPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tickets, setTickets] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [isLoading, setIsLoading] = useState(true);

  const currentFilters = {
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    category: searchParams.get('category') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    order: searchParams.get('order') || 'desc',
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '10', 10),
    assignedOnly: searchParams.get('assignedOnly') || ''
  };

  const fetchTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.status) params.status = currentFilters.status;
      if (currentFilters.priority) params.priority = currentFilters.priority;
      if (currentFilters.category) params.category = currentFilters.category;
      if (currentFilters.sortBy) params.sortBy = currentFilters.sortBy;
      if (currentFilters.order) params.order = currentFilters.order;
      if (currentFilters.page) params.page = currentFilters.page;
      if (currentFilters.limit) params.limit = currentFilters.limit;
      if (currentFilters.assignedOnly) params.assignedOnly = currentFilters.assignedOnly;

      const res = await getTickets(params);
      setTickets(res.data.tickets || []);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentFilters.search,
    currentFilters.status,
    currentFilters.priority,
    currentFilters.category,
    currentFilters.sortBy,
    currentFilters.order,
    currentFilters.page,
    currentFilters.limit,
    currentFilters.assignedOnly
  ]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleFilterChange = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    if (key !== 'page') {
      nextParams.set('page', '1');
    }
    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    handleFilterChange('page', newPage.toString());
  };

  const handleLimitChange = (newLimit) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('limit', newLimit.toString());
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const statusTabs = [
    { label: 'All Tickets', value: '' },
    { label: 'Open', value: STATUSES.OPEN },
    { label: 'In Progress', value: STATUSES.IN_PROGRESS },
    { label: 'Waiting on Customer', value: STATUSES.WAITING_FOR_CUSTOMER },
    { label: 'Resolved', value: STATUSES.RESOLVED },
    { label: 'Closed', value: STATUSES.CLOSED }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border/60">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Support Tickets</h2>
          <p className="text-xs text-slate-400 mt-1">
            {user?.role === 'CUSTOMER'
              ? 'View, track, and update all tickets raised by your account'
              : 'Enterprise queue management, filtering, and ticket assignment'}
          </p>
        </div>

        {user?.role !== 'AGENT' && (
          <Link to="/tickets/new">
            <Button size="sm" icon={Plus}>
              Create Ticket
            </Button>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-surface-border/50 text-xs">
        {statusTabs.map((tab) => {
          const isActive = (currentFilters.status || '') === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => handleFilterChange('status', tab.value)}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          );
        })}

        {user?.role === 'AGENT' && (
          <button
            onClick={() =>
              handleFilterChange(
                'assignedOnly',
                currentFilters.assignedOnly === 'true' ? '' : 'true'
              )
            }
            className={`ml-auto px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              currentFilters.assignedOnly === 'true'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover border border-transparent'
            }`}
          >
            Assigned to Me
          </button>
        )}
      </div>

      <TicketFilters
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-card border border-surface-border rounded-xl overflow-hidden"
            >
              <SkeletonRow />
            </div>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={TicketIcon}
          title="No tickets found"
          description="There are no tickets matching your specified search and filter criteria."
          actionLabel={user?.role !== 'AGENT' ? 'Create a New Ticket' : undefined}
          onAction={user?.role !== 'AGENT' ? () => {} : undefined}
        />
      ) : (
        <div className="space-y-2.5">
          {tickets.map((ticket) => (
            <TicketRow key={ticket._id} ticket={ticket} />
          ))}
        </div>
      )}

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        total={meta.total}
        limit={meta.limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
};
