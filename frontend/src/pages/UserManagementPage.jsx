import React, { useState, useEffect, useCallback } from 'react';
import { getUsers, updateUser, deleteUser } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Pagination } from '../components/common/Pagination';
import { SkeletonTable } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Select } from '../components/common/Select';
import { ROLES, formatDateTime } from '../utils/constants';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  Headphones,
  User as UserIcon,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const { success, error } = useToast();

  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  const [editingUser, setEditingUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = { page, limit: 10 };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (roleFilter) params.role = roleFilter;

      const res = await getUsers(params);
      setUsers(res.data.users || []);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, roleFilter, error]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setIsUpdating(true);
      await updateUser(editingUser._id, {
        role: editingUser.role,
        isActive: editingUser.isActive
      });
      success('User parameters updated', 'Success');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      setIsDeleting(true);
      await deleteUser(deletingUser._id);
      success('User deleted successfully', 'Success');
      setDeletingUser(null);
      fetchUsers();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return <Shield className="w-3.5 h-3.5 text-purple-400" />;
      case ROLES.AGENT:
        return <Headphones className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <UserIcon className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case ROLES.AGENT:
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border/60">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">User Directory</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage enterprise accounts, roles, access permissions, and status
          </p>
        </div>
      </div>

      <div className="bg-surface-card border border-surface-border rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-surface-100 border border-surface-border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="text-xs bg-surface-100 border border-surface-border rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All Roles</option>
          <option value={ROLES.CUSTOMER}>Customers</option>
          <option value={ROLES.AGENT}>Support Agents</option>
          <option value={ROLES.ADMIN}>Administrators</option>
        </select>
      </div>

      {isLoading ? (
        <SkeletonTable rows={6} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="There are no user accounts matching your search query."
        />
      ) : (
        <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-border bg-surface-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-xs">
                {users.map((u) => {
                  const isSelf = u._id === currentUser?._id;

                  return (
                    <tr key={u._id} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-50 border border-surface-subtle flex items-center justify-center font-semibold text-xs text-brand-400 shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-100">
                              {u.name} {isSelf && <span className="text-[10px] text-brand-400 font-mono">(You)</span>}
                            </p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${getRoleBadgeClass(
                            u.role
                          )}`}
                        >
                          {getRoleIcon(u.role)}
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-400">
                            <XCircle className="w-3.5 h-3.5" />
                            Deactivated
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {formatDateTime(u.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingUser(u)}
                            disabled={isSelf}
                            title={isSelf ? 'Cannot edit own role' : 'Edit User'}
                            className="p-1.5 rounded-lg border border-surface-border text-slate-400 hover:text-white hover:bg-surface-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingUser(u)}
                            disabled={isSelf}
                            title={isSelf ? 'Cannot delete own account' : 'Delete User'}
                            className="p-1.5 rounded-lg border border-surface-border text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        total={meta.total}
        limit={meta.limit}
        onPageChange={(p) => setPage(p)}
      />

      {editingUser && (
        <Modal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          title={`Edit Account: ${editingUser.name}`}
        >
          <form onSubmit={handleSaveUser} className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Email</p>
              <p className="text-sm font-medium text-slate-200">{editingUser.email}</p>
            </div>

            <Select
              label="Assigned System Role"
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser((prev) => ({ ...prev, role: e.target.value }))
              }
              options={[
                { value: ROLES.CUSTOMER, label: 'Customer' },
                { value: ROLES.AGENT, label: 'Support Agent' },
                { value: ROLES.ADMIN, label: 'Administrator' }
              ]}
            />

            <Select
              label="Account State"
              value={editingUser.isActive ? 'true' : 'false'}
              onChange={(e) =>
                setEditingUser((prev) => ({
                  ...prev,
                  isActive: e.target.value === 'true'
                }))
              }
              options={[
                { value: 'true', label: 'Active — Can sign in and access SupportFlow' },
                { value: 'false', label: 'Deactivated — Blocked from authentication' }
              ]}
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
              <Button
                variant="secondary"
                onClick={() => setEditingUser(null)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isUpdating}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete ${deletingUser?.name} (${deletingUser?.email})? This action cannot be undone.`}
        confirmText="Delete Account"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};
