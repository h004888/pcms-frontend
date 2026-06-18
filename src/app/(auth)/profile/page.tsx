// =====================================================
// /profile — CUST-PROFILE (vivid edition, refactored)
// Orchestrator — composes sub-components from _components/
// =====================================================

"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
	Shield,
	Phone,
	Award,
	User,
	Mail,
	Calendar,
	Sparkles,
	Gift,
	Heart,
} from "lucide-react";
import { ProfileHero } from "./_components/ProfileHero";
import { ProfileStats } from "./_components/ProfileStats";
import {
	ProfileForm,
	validateProfile,
	type ProfileFormData,
	type ProfileErrors,
} from "./_components/ProfileForm";

interface Profile extends ProfileFormData {
	tier: string;
	memberSince: string;
}

const INITIAL: Profile = {
	name: "Nguyễn Văn A",
	email: "nguyenvana@example.com",
	phone: "0901234567",
	birthday: "1990-05-15",
	gender: "Nam",
	tier: "Vàng",
	memberSince: "2023-08-12",
};

const STATS = [
	{
		icon: Sparkles,
		label: "Điểm hiện tại",
		value: "1.250",
		color: "accent" as const,
	},
	{ icon: Gift, label: "Quà đã đổi", value: "5", color: "warning" as const },
	{ icon: Heart, label: "Lượt thích", value: "23", color: "danger" as const },
];

export default function ProfilePage() {
	const [profile, setProfile] = useState<Profile>(INITIAL);
	const [draft, setDraft] = useState<ProfileFormData>(INITIAL);
	const [editing, setEditing] = useState(false);
	const [errors, setErrors] = useState<ProfileErrors>({});

	const startEdit = () => {
		setDraft(profile);
		setErrors({});
		setEditing(true);
	};

	const cancelEdit = () => {
		setDraft(profile);
		setErrors({});
		setEditing(false);
	};

	const save = () => {
		const errs = validateProfile(draft);
		setErrors(errs);
		if (Object.keys(errs).length > 0) {
			toast.error("Vui lòng kiểm tra các trường lỗi");
			return;
		}
		setProfile({ ...profile, ...draft });
		setEditing(false);
		toast.success("Đã lưu thông tin cá nhân");
	};

	const updateField = <K extends keyof ProfileFormData>(
		key: K,
		value: ProfileFormData[K],
	) => {
		setDraft((d) => ({ ...d, [key]: value }));
		if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
	};

	return (
		<div className="space-y-5">
			<ProfileHero
				name={profile.name}
				tier={profile.tier}
				memberSince={profile.memberSince}
				editing={editing}
				onStartEdit={startEdit}
			/>

			<ProfileStats stats={STATS} />

			<div className="space-y-4">
				{editing ? (
					<section className="p-5 bg-white border border-ink-200 rounded-lg">
						<h2 className="text-base font-semibold text-ink-900 mb-1">
							Chỉnh sửa thông tin
						</h2>
						<p className="text-sm text-ink-500 mb-4">
							Cập nhật thông tin cá nhân của bạn. Email dùng để đăng nhập và
							nhận thông báo đơn hàng.
						</p>
						<ProfileForm
							draft={draft}
							errors={errors}
							onChange={updateField}
							onSave={save}
							onCancel={cancelEdit}
						/>
					</section>
				) : (
					<section className="p-5 bg-white border border-ink-200 rounded-lg">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-base font-semibold text-ink-900">
								Thông tin cá nhân
							</h2>
							<span className="text-xs text-ink-500">
								Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
							</span>
						</div>
						<div className="grid sm:grid-cols-2 gap-4">
							<Field label="Họ tên" value={profile.name} icon={User} />
							<Field label="Email" value={profile.email} icon={Mail} />
							<Field label="Số điện thoại" value={profile.phone} icon={Phone} />
							<Field
								label="Ngày sinh"
								value={new Date(profile.birthday).toLocaleDateString("vi-VN")}
								icon={Calendar}
							/>
							<Field label="Giới tính" value={profile.gender} icon={User} />
							<Field
								label="Hạng thành viên"
								value={profile.tier}
								icon={Award}
								tone="warning"
							/>
						</div>
					</section>
				)}

				<section className="p-5 bg-white border border-ink-200 rounded-lg">
					<h2 className="text-base font-semibold text-ink-900 mb-4">
						Bảo mật tài khoản
					</h2>
					<div className="space-y-3">
						<SecurityAction
							icon={Shield}
							label="Đổi mật khẩu"
							cta="Cập nhật →"
							ctaColor="accent"
						/>
						<SecurityAction
							icon={Phone}
							label="Xác thực 2 yếu tố (2FA)"
							cta="Chưa bật →"
							ctaColor="warning"
						/>
					</div>
				</section>
			</div>
		</div>
	);
}

function Field({
	label,
	value,
	icon: Icon,
	tone,
}: {
	label: string;
	value: string;
	icon: React.ComponentType<{
		className?: string;
		"aria-hidden"?: boolean | "true" | "false";
	}>;
	tone?: "warning";
}) {
	return (
		<div>
			<div className="flex items-center gap-1.5 mb-1">
				<Icon className="w-3.5 h-3.5 text-ink-500" aria-hidden="true" />
				<p className="text-xs font-medium text-ink-500">{label}</p>
			</div>
			{tone === "warning" ? (
				<span className="inline-flex items-center gap-1 px-2 h-6 bg-warning-100 text-warning-700 text-xs font-bold rounded-full">
					<Award className="w-3 h-3" aria-hidden="true" />
					{value}
				</span>
			) : (
				<p className="text-sm font-medium text-ink-900">{value}</p>
			)}
		</div>
	);
}

function SecurityAction({
	icon: Icon,
	label,
	cta,
	ctaColor,
}: {
	icon: React.ComponentType<{
		className?: string;
		"aria-hidden"?: boolean | "true" | "false";
	}>;
	label: string;
	cta: string;
	ctaColor: "accent" | "warning";
}) {
	const ctaClass =
		ctaColor === "accent" ? "text-accent-700" : "text-warning-700";
	return (
		<button className="w-full flex items-center justify-between p-3 bg-ink-50 rounded-md hover:bg-ink-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500">
			<div className="flex items-center gap-3">
				<Icon className="w-4 h-4 text-ink-600" aria-hidden="true" />
				<span className="text-sm font-medium text-ink-900">{label}</span>
			</div>
			<span className={`text-xs font-semibold ${ctaClass}`}>{cta}</span>
		</button>
	);
}
