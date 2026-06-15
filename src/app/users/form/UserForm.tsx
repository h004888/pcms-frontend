// =====================================================
// PCMS - User Form (Create/Edit)
// =====================================================

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Select, Checkbox, Button } from '@/components/ui';
import { CreateUserRequest, User, Role, UserStatus } from '@/types';
import apiClient, { getErrorMessage } from '@/lib/api';
import { isValidEmail } from '@/lib/utils';
import toast from 'react-hot-toast';

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Quản trị viên' },
  { value: 'CEO', label: 'Giám đốc điều hành' },
  { value: 'BRANCH_MANAGER', label: 'Quản lý chi nhánh' },
  { value: 'PHARMACIST', label: 'Dược sĩ' },
  { value: 'CUSTOMER', label: 'Khách hàng' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Vô hiệu' },
  { value: 'LOCKED', label: 'Đã khóa' },
];

export function UserForm({
  open,
  onClose,
  item,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  item: User | null;
  onSuccess: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<CreateUserRequest>({
    defaultValues: {
      email: '',
      fullName: '',
      phone: '',
      role: 'PHARMACIST' as Role,
      status: 'ACTIVE' as UserStatus,
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        email: item.email,
        fullName: item.fullName,
        phone: item.phone || '',
        role: item.role,
        branchId: item.branchId,
        status: item.status,
      });
    } else {
      reset({
        email: '', fullName: '', phone: '', role: 'PHARMACIST', status: 'ACTIVE',
      });
    }
  }, [item, reset]);

  const onSubmit = async (data: CreateUserRequest) => {
    try {
      if (item) {
        await apiClient.put(`/users/${item.id}`, data);
        toast.success('Cập nhật người dùng thành công');
      } else {
        await apiClient.post('/users', data);
        toast.success('Tạo người dùng thành công');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const selectedRole = watch('role');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Họ tên"
          required
          {...register('fullName', { required: 'Họ tên bắt buộc' })}
          error={errors.fullName?.message}
        />
        <Input
          label="Email"
          type="email"
          required
          {...register('email', {
            required: 'Email bắt buộc',
            validate: (v) => isValidEmail(v) || 'Email không hợp lệ',
          })}
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Số điện thoại"
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
        />
        <Select
          label="Vai trò"
          required
          options={ROLE_OPTIONS}
          {...register('role', { required: 'Vai trò bắt buộc' })}
          error={errors.role?.message}
        />
      </div>

      {selectedRole !== 'ADMIN' && selectedRole !== 'CUSTOMER' && (
        <Input
          label="Chi nhánh (UUID)"
          placeholder="Ví dụ: 00000000-0000-0000-0000-000000000001"
          {...register('branchId')}
          hint="Để trống nếu không thuộc chi nhánh nào"
        />
      )}

      <Select
        label="Trạng thái"
        options={STATUS_OPTIONS}
        {...register('status')}
      />

      {!item && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-800">
          ℹ️ Mật khẩu tạm thời sẽ được gửi qua email khi tạo tài khoản.
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 -mx-5 px-5 -mb-4 pb-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {item ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}
