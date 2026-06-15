// =====================================================
// PCMS - Users List Page (SCR-USER-LIST)
// UC02: Manage Users
// =====================================================

'use client';

import { DashboardLayout } from '@/components/Layout';
import { ListPage } from '@/components/shared/ListPage';
import { Badge, Button, Column } from '@/components/ui';
import { User, UserStatus, Role } from '@/types';
import { ROLE_LABELS, formatDateTime, shortId, getStatusColor } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Pencil, Trash2, KeyRound } from 'lucide-react';
import { UserForm } from './form/UserForm';
import apiClient, { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function UsersPage() {
  const { state: authState } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDelete = async (user: User) => {
    if (!confirm(`Xác nhận vô hiệu hóa người dùng "${user.fullName}"?`)) return;
    try {
      await apiClient.delete(`/users/${user.id}`);
      toast.success('Đã vô hiệu hóa người dùng');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleResetPassword = async (user: User) => {
    if (!confirm(`Gửi email reset mật khẩu cho "${user.email}"?`)) return;
    try {
      await apiClient.post(`/users/${user.id}/reset-password`);
      toast.success('Đã gửi email reset mật khẩu');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '100px',
      render: (u) => <span className="font-mono text-xs">{shortId(u.id)}</span>,
    },
    {
      key: 'fullName',
      header: 'Họ tên',
      render: (u) => (
        <div>
          <p className="font-medium text-gray-900">{u.fullName}</p>
          <p className="text-xs text-gray-500">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Vai trò',
      width: '180px',
      render: (u) => <Badge variant="info">{ROLE_LABELS[u.role] || u.role}</Badge>,
    },
    {
      key: 'phone',
      header: 'SĐT',
      width: '120px',
      render: (u) => u.phone || '—',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '110px',
      render: (u) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(u.status)}`}>
          {u.status}
        </span>
      ),
    },
    {
      key: 'lastLoginAt',
      header: 'Đăng nhập cuối',
      width: '160px',
      render: (u) => <span className="text-xs text-gray-500">{formatDateTime(u.lastLoginAt)}</span>,
    },
  ];

  return (
    <DashboardLayout>
      <ListPage<User>
        key={refreshKey}
        title="Quản lý người dùng"
        subtitle="UC02 - Admin/CEO quản lý tài khoản hệ thống"
        endpoint="/users"
        columns={columns}
        searchPlaceholder="Tìm theo tên hoặc email..."
        renderForm={({ open, onClose, item, refetch }) => (
          <UserForm open={open} onClose={onClose} item={item} onSuccess={refetch} />
        )}
        customActions={(u) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleResetPassword(u); }}
              className="p-1 text-gray-500 hover:text-blue-600"
              title="Reset mật khẩu"
            >
              <KeyRound className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(u); }}
              className="p-1 text-gray-500 hover:text-red-600"
              title="Vô hiệu hóa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />
    </DashboardLayout>
  );
}
