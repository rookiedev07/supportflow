import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/analyticsService';
import { StatCard } from '../components/dashboard/StatCard';
import { StatusDistribution } from '../components/dashboard/StatusDistribution';
import { PriorityDistribution } from '../components/dashboard/PriorityDistribution';
import { TicketVolumeChart } from '../components/dashboard/TicketVolumeChart';
import { RecentActivityList } from '../components/dashboard/RecentActivityList';
import { TicketRow } from '../components/tickets/TicketRow';
import { Button } from '../components/common/Button';
import { SkeletonBox } from '../components/common/SkeletonLoader';
import {
  Inbox,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Plus,
  ArrowRight,
  Headphones,
  ShieldAlert
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getDashboardStats();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonBox className="lg:col-span-2 h-72 rounded-xl" />
          <SkeletonBox className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  const role = user?.role;
  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border/60">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Welcome back, {user?.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {role === 'CUSTOMER' && 'Monitor and create your support inquiries'}
            {role === 'AGENT' && 'Manage assigned tickets and resolve customer issues'}
            {role === 'ADMIN' && 'System-wide support desk performance and workload telemetry'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {role !== 'AGENT' && (
            <Link to="/tickets/new">
              <Button size="sm" icon={Plus}>
                Create Ticket
              </Button>
            </Link>
          )}
          <Link to="/tickets">
            <Button size="sm" variant="secondary" icon={ArrowRight}>
              View All Tickets
            </Button>
          </Link>
        </div>
      </div>

      {role === 'CUSTOMER' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Open Tickets"
            value={stats.openTickets || 0}
            subtitle="Awaiting agent pick-up"
            icon={Inbox}
            variant="sky"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgressTickets || 0}
            subtitle="Currently under investigation"
            icon={Clock}
            variant="primary"
          />
          <StatCard
            title="Action Needed"
            value={stats.waitingTickets || 0}
            subtitle="Waiting for your input"
            icon={AlertCircle}
            variant="warning"
          />
          <StatCard
            title="Resolved"
            value={stats.resolvedTickets || 0}
            subtitle="Closed or finalized"
            icon={CheckCircle}
            variant="success"
          />
        </div>
      )}

      {role === 'AGENT' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Assigned"
            value={stats.assignedTickets || 0}
            subtitle="Tickets assigned to you"
            icon={Headphones}
            variant="primary"
          />
          <StatCard
            title="Active Tickets"
            value={stats.activeAssigned || 0}
            subtitle="Currently open or in progress"
            icon={Clock}
            variant="sky"
          />
          <StatCard
            title="Needs Attention"
            value={stats.requiringAttention || 0}
            subtitle="Unassigned or awaiting action"
            icon={ShieldAlert}
            variant="warning"
          />
          <StatCard
            title="Resolved"
            value={stats.resolvedByAgent || 0}
            subtitle="Successfully resolved"
            icon={CheckCircle}
            variant="success"
          />
        </div>
      )}

      {role === 'ADMIN' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tickets"
            value={stats.totalTickets || 0}
            subtitle="System-wide ticket volume"
            icon={Inbox}
            variant="primary"
          />
          <StatCard
            title="Open Queue"
            value={stats.openTickets || 0}
            subtitle="Awaiting assignment/progress"
            icon={AlertCircle}
            variant="sky"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgressTickets || 0}
            subtitle="Currently being worked on"
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers || 0}
            subtitle="Customers, agents & admins"
            icon={Users}
            variant="success"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {role === 'ADMIN' && data?.volumeByDate && (
            <TicketVolumeChart data={data.volumeByDate} />
          )}

          <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white tracking-tight">
                {role === 'CUSTOMER' ? 'Your Recent Tickets' : 'Recent Ticket Queue'}
              </h3>
              <Link
                to="/tickets"
                className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {data?.recentTickets && data.recentTickets.length > 0 ? (
              <div className="space-y-2.5">
                {data.recentTickets.map((ticket) => (
                  <TicketRow key={ticket._id} ticket={ticket} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-8 text-center">No recent tickets to display</p>
            )}
          </div>

          {role === 'ADMIN' && data?.agentWorkload && (
            <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Support Agent Workload
                </h3>
                <span className="text-xs text-slate-400">Active Queue</span>
              </div>

              {data.agentWorkload.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No active assignments currently recorded
                </p>
              ) : (
                <div className="divide-y divide-surface-border">
                  {data.agentWorkload.map((agent) => (
                    <div
                      key={agent.agentId}
                      className="py-3 flex items-center justify-between first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 flex items-center justify-center text-xs font-semibold">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-200">{agent.name}</p>
                          <p className="text-[10px] text-slate-400">{agent.email}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono bg-surface-100 border border-surface-border px-2.5 py-1 rounded-full text-slate-300">
                        {agent.activeTickets} active tickets
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {data?.statusDistribution && (
            <StatusDistribution distribution={data.statusDistribution} />
          )}

          {data?.priorityDistribution && (
            <PriorityDistribution distribution={data.priorityDistribution} />
          )}

          {data?.recentActivity && (
            <RecentActivityList activities={data.recentActivity} />
          )}
        </div>
      </div>
    </div>
  );
};
