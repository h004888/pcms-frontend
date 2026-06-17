// =====================================================
// PCMS - Compose Notification Form (SCR-NOTIF-COMPOSE · UC13)
// Trang riêng cho Admin/CEO soạn broadcast — tách khỏi
// NotificationsView (SCR-NOTIF-LIST) để khớp SRS §3.1.2.
// Hỗ trợ 3 kênh: in-app / email / SMS, audience = all / role / branch.
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Send, ArrowLeft, Bell, Mail, MessageSquare,
  Users, Shield, Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/Layout';
import { Card, Button, Select, Input, Textarea, Alert, Badge } from '@/components/ui';
import { apiClient, getErrorMessage } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { ROLE_LABELS } from '@/lib/utils';
import type { Branch, Role } from '@/types';

type Channel = 'IN_APP' | 'EMAIL' | 'SMS';
type AudienceType = 'ALL' | 'ROLE' | 'BRANCH';

const CHANNEL_OPTIONS: { value: Channel; label: string; icon: typeof Bell; hint: string }[] = [
  { value: 'IN_APP', label: 'In-App', icon: Bell, hint: 'Hiển thị trong hộp thư người dùng' },
  { value: 'EMAIL', label: 'Email', icon: Mail, hint: 'Gửi qua Email Provider (MSG11)' },
  { value: 'SMS', label: 'SMS', icon: MessageSquare, hint: 'Gửi qua SMS Provider — tốn phí' },
];

const TEMPLATES = [
  { value: 'NTPL-ADMIN-BROADCAST', label: 'Thông báo chung' },
  { value: 'NTPL-LOW-STOCK', label: 'Cảnh báo tồn kho thấp' },
  { value: 'NTPL-EXPIRY', label: 'Cảnh báo hết hạn' },
  { value: 'NTPL-MAINTENANCE', label: 'Bảo trì hệ thống' },
  { value: 'NTPL-POLICY', label: 'Cập nhật chính sách' },
];

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'ADMIN', label: ROLE_LABELS.ADMIN },
  { value: 'CEO', label: ROLE_LABELS.CEO },
  { value: 'BRANCH_MANAGER', label: ROLE_LABELS.BRANCH_MANAGER },
  { value: 'PHARMACIST', label: ROLE_LABELS.PHARMACIST },
  { value: 'CUSTOMER', label: ROLE_LABELS.CUSTOMER },
];

export function ComposeNotificationForm() {
  const router = useRouter();
  const { state } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  const [form, setForm] = useState({
    title: '',
    body: '',
    channel: 'IN_APP' as Channel,
    template: 'NTPL-ADMIN-BROADCAST',
    audienceType: 'ALL' as AudienceType,
    audienceRole: 'PHARMACIST' as Role,
    audienceBranchId: '',
    priority: 'NORMAL' as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT',
  });

  useEffect(() => {
    apiClient.get('/branches?size=50').then((r) => setBranches(r.data.data || [])).catch(() => {});
  }, []);

  // Guard: chỉ Admin/CEO
  useEffect(() => {
    if (state.user && state.user.role !== 'ADMIN' && state.user.role !== 'CEO') {
      toast.error('Bạn không có quyền soạn thông báo (chỉ Admin/CEO)');
      router.push('/notifications');
    }
  }, [state.user, router]);

  const charCount = form.body.length;
  const smsWarning = form.channel === 'SMS' && charCount > 160;

  const isFormValid = form.title.trim() && form.body.trim() && (
    form.audienceType !== 'BRANCH' || form.audienceBranchId !== ''
  );

  const audienceDescription = (() => {
    if (form.audienceType === 'ALL') return 'Tất cả người dùng trong hệ thống';
    if (form.audienceType === 'ROLE') {
      return `Người dùng có vai trò: ${ROLE_LABELS[form.audienceRole]}`;
    }
    const br = branches.find((b) => b.id === form.audienceBranchId);
    return `Chi nhánh: ${br ? `${br.code} — ${br.name}` : '—'}`;
  })();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error('Vui lòng điền tiêu đề, nội dung và chọn người nhận');
      return;
    }
    if (!confirm(`Gửi thông báo "${form.title}" tới ${audienceDescription}?`)) {
      return;
    }
    setSubmitting(true);
    try {
      const audience =
        form.audienceType === 'ALL'
          ? { type: 'ALL' }
          : form.audienceType === 'ROLE'
            ? { type: 'ROLE', role: form.audienceRole }
            : { type: 'BRANCH', branchId: form.audienceBranchId };

      await apiClient.post('/notifications/broadcast', {
        title: form.title,
        body: form.body,
        channel: form.channel,
        template: form.template,
        priority: form.priority,
        audience,
        actorId: state.user?.id,
      });
      toast.success(`Đã gửi thông báo tới ${audienceDescription}`);
      router.push('/notifications');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendTest = async () => {
    if (!form.title || !form.body) {
      toast.error('Điền tiêu đề + nội dung trước khi gửi test');
      return;
    }
    setSendingTest(true);
    try {
      await apiClient.post('/notifications/test', {
        title: form.title,
        body: form.body,
        channel: form.channel,
        recipientId: state.user?.id,
      });
      toast.success('Đã gửi bản test tới tài khoản của bạn');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <DashboardLayout>
      <Button
        variant="outline"
        onClick={() => router.push('/notifications')}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        className="mb-4"
      >
        Quay lại
      </Button>

      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Send className="w-6 h-6 text-ink-700" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-ink-900">Soạn thông báo</h1>
          <Badge variant="info">Chỉ Admin / CEO</Badge>
        </div>
        <p className="text-sm text-ink-500 mt-1">
          UC13 · Gửi broadcast tới người dùng · NSF-09 retry 3x nếu kênh thất bại
        </p>
      </div>

      <form onSubmit={handleSend}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* === Nội dung === */}
            <Card title="Nội dung thông báo">
              <div className="space-y-4">
                <Input
                  label="Tiêu đề"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="VD: Cập nhật giờ làm việc từ 01/07"
                  maxLength={120}
                  hint={`${form.title.length}/120 ký tự`}
                />

                <Textarea
                  label="Nội dung"
                  required
                  rows={5}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Nội dung chi tiết. Hỗ trợ xuống dòng. SMS sẽ bị cắt ở 160 ký tự."
                  hint={
                    smsWarning
                      ? `SMS: ${charCount}/160 — sẽ bị cắt thành ${Math.ceil(charCount / 153)} tin`
                      : `${charCount} ký tự`
                  }
                  error={smsWarning ? undefined : undefined}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Template"
                    options={TEMPLATES.map((t) => ({ value: t.value, label: t.label }))}
                    value={form.template}
                    onChange={(e) => setForm({ ...form, template: e.target.value })}
                  />
                  <Select
                    label="Mức ưu tiên"
                    options={[
                      { value: 'LOW', label: 'Thấp' },
                      { value: 'NORMAL', label: 'Bình thường' },
                      { value: 'HIGH', label: 'Cao' },
                      { value: 'URGENT', label: 'Khẩn cấp' },
                    ]}
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                  />
                </div>
              </div>
            </Card>

            {/* === Kênh gửi === */}
            <Card title="Kênh gửi">
              <fieldset>
                <legend className="sr-only">Chọn kênh gửi</legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CHANNEL_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = form.channel === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={[
                          'relative flex flex-col gap-1.5 p-4 rounded-md border-2 cursor-pointer transition-colors',
                          active
                            ? 'border-accent-500 bg-accent-50'
                            : 'border-ink-200 bg-white hover:border-ink-300',
                        ].join(' ')}
                      >
                        <input
                          type="radio"
                          name="channel"
                          value={opt.value}
                          checked={active}
                          onChange={() => setForm({ ...form, channel: opt.value })}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-2">
                          <Icon className={active ? 'w-4 h-4 text-accent-700' : 'w-4 h-4 text-ink-500'} aria-hidden="true" />
                          <span className="font-medium text-sm">{opt.label}</span>
                        </div>
                        <p className="text-xs text-ink-500">{opt.hint}</p>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </Card>

            {/* === Audience === */}
            <Card title="Người nhận">
              <fieldset>
                <legend className="sr-only">Chọn nhóm người nhận</legend>
                <div className="space-y-3">
                  {[
                    { value: 'ALL', label: 'Tất cả người dùng', icon: Users, desc: 'Mọi tài khoản trong hệ thống' },
                    { value: 'ROLE', label: 'Theo vai trò', icon: Shield, desc: 'Chọn 1 vai trò cụ thể' },
                    { value: 'BRANCH', label: 'Theo chi nhánh', icon: Building2, desc: 'Tất cả nhân sự 1 chi nhánh' },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    const active = form.audienceType === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={[
                          'flex items-start gap-3 p-3 rounded-md border cursor-pointer',
                          active
                            ? 'border-accent-500 bg-accent-50'
                            : 'border-ink-200 hover:border-ink-300',
                        ].join(' ')}
                      >
                        <input
                          type="radio"
                          name="audience"
                          value={opt.value}
                          checked={active}
                          onChange={() => setForm({ ...form, audienceType: opt.value as AudienceType })}
                          className="sr-only"
                        />
                        <Icon className={active ? 'w-4 h-4 text-accent-700 mt-0.5' : 'w-4 h-4 text-ink-500 mt-0.5'} aria-hidden="true" />
                        <div>
                          <p className="text-sm font-medium text-ink-900">{opt.label}</p>
                          <p className="text-xs text-ink-500">{opt.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {form.audienceType === 'ROLE' && (
                  <Select
                    label="Vai trò"
                    className="mt-3"
                    options={ROLE_OPTIONS.map((r) => ({ value: r.value, label: r.label }))}
                    value={form.audienceRole}
                    onChange={(e) => setForm({ ...form, audienceRole: e.target.value as Role })}
                  />
                )}

                {form.audienceType === 'BRANCH' && (
                  <Select
                    label="Chi nhánh"
                    required
                    className="mt-3"
                    options={[
                      { value: '', label: '— Chọn chi nhánh —' },
                      ...branches.map((b) => ({ value: b.id, label: `${b.code} — ${b.name}` })),
                    ]}
                    value={form.audienceBranchId}
                    onChange={(e) => setForm({ ...form, audienceBranchId: e.target.value })}
                  />
                )}
              </fieldset>
            </Card>
          </div>

          {/* === Preview sidebar === */}
          <div className="space-y-4">
            <Card title="Xem trước">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-ink-500">
                  {(() => {
                    const opt = CHANNEL_OPTIONS.find((o) => o.value === form.channel);
                    const Icon = opt?.icon || Bell;
                    return (
                      <>
                        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{opt?.label}</span>
                        <Badge variant={form.priority === 'URGENT' ? 'danger' : form.priority === 'HIGH' ? 'warning' : 'gray'}>
                          {form.priority}
                        </Badge>
                      </>
                    );
                  })()}
                </div>

                <div className="rounded-md border border-ink-200 p-3 bg-ink-50">
                  <p className="font-semibold text-ink-900 text-sm">
                    {form.title || <span className="text-ink-400 italic">Tiêu đề...</span>}
                  </p>
                  <p className="text-sm text-ink-600 mt-1 whitespace-pre-wrap">
                    {form.body || <span className="text-ink-400 italic">Nội dung...</span>}
                  </p>
                </div>

                <Alert variant="info">
                  Gửi tới: <strong>{audienceDescription}</strong>
                </Alert>

                {form.channel === 'SMS' && smsWarning && (
                  <Alert variant="warning">
                    Nội dung vượt 160 ký tự — sẽ thành {Math.ceil(charCount / 153)} tin SMS, tốn thêm phí.
                  </Alert>
                )}
              </div>
            </Card>

            <div className="space-y-2">
              <Button
                type="submit"
                loading={submitting}
                disabled={!isFormValid}
                fullWidth
                leftIcon={<Send className="w-4 h-4" />}
              >
                Gửi thông báo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSendTest}
                loading={sendingTest}
                fullWidth
              >
                Gửi bản test cho tôi
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/notifications')}
                fullWidth
              >
                Huỷ
              </Button>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
