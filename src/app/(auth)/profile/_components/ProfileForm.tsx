// =====================================================
// ProfileForm — edit form với validation
// Extracted từ profile page để giảm cyclomatic complexity
// =====================================================

"use client";

import { Save, X } from "lucide-react";
import clsx from "clsx";

export interface ProfileFormData {
	name: string;
	email: string;
	phone: string;
	birthday: string;
	gender: "Nam" | "Nữ" | "Khác";
}

export type ProfileErrors = Partial<Record<keyof ProfileFormData, string>>;

export function validateProfile(data: ProfileFormData): ProfileErrors {
	const e: ProfileErrors = {};
	if (!data.name.trim()) e.name = "Họ tên không được để trống";
	else if (data.name.trim().length < 2) e.name = "Họ tên quá ngắn";

	if (!data.email.trim()) e.email = "Email không được để trống";
	else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
		e.email = "Email không hợp lệ";

	if (!data.phone.trim()) e.phone = "Số điện thoại không được để trống";
	else if (!/^(0|\+84)[0-9]{9,10}$/.test(data.phone.replace(/\s/g, "")))
		e.phone = "Số điện thoại không hợp lệ (VD: 0901234567)";

	if (!data.birthday) e.birthday = "Ngày sinh không được để trống";

	return e;
}

interface ProfileFormProps {
	draft: ProfileFormData;
	errors: ProfileErrors;
	onChange: <K extends keyof ProfileFormData>(
		key: K,
		value: ProfileFormData[K],
	) => void;
	onSave: () => void;
	onCancel: () => void;
}

export function ProfileForm({
	draft,
	errors,
	onChange,
	onSave,
	onCancel,
}: ProfileFormProps) {
	const inputClass = (hasError: boolean) =>
		clsx(
			"w-full h-10 px-3 text-sm bg-white border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent-200",
			hasError
				? "border-danger-500 focus:border-danger-500"
				: "border-ink-200 focus:border-accent-500",
		);

	return (
		<div className="space-y-4">
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-ink-900 mb-1"
				>
					Họ tên <span className="text-danger-600">*</span>
				</label>
				<input
					id="name"
					type="text"
					value={draft.name}
					onChange={(e) => onChange("name", e.target.value)}
					className={inputClass(!!errors.name)}
					placeholder="Nguyễn Văn A"
					aria-invalid={!!errors.name}
					aria-describedby={errors.name ? "name-err" : undefined}
				/>
				{errors.name && (
					<p
						id="name-err"
						className="mt-1 text-xs text-danger-600"
						role="alert"
					>
						{errors.name}
					</p>
				)}
			</div>

			<div className="grid sm:grid-cols-2 gap-3">
				<div>
					<label
						htmlFor="birthday"
						className="block text-sm font-medium text-ink-900 mb-1"
					>
						Ngày sinh <span className="text-danger-600">*</span>
					</label>
					<input
						id="birthday"
						type="date"
						value={draft.birthday}
						onChange={(e) => onChange("birthday", e.target.value)}
						className={inputClass(!!errors.birthday)}
						aria-invalid={!!errors.birthday}
					/>
					{errors.birthday && (
						<p className="mt-1 text-xs text-danger-600" role="alert">
							{errors.birthday}
						</p>
					)}
				</div>
				<div>
					<label
						htmlFor="gender"
						className="block text-sm font-medium text-ink-900 mb-1"
					>
						Giới tính <span className="text-danger-600">*</span>
					</label>
					<select
						id="gender"
						value={draft.gender}
						onChange={(e) =>
							onChange("gender", e.target.value as ProfileFormData["gender"])
						}
						className={inputClass(false)}
					>
						<option value="Nam">Nam</option>
						<option value="Nữ">Nữ</option>
						<option value="Khác">Khác</option>
					</select>
				</div>
			</div>

			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-ink-900 mb-1"
				>
					Email <span className="text-danger-600">*</span>
				</label>
				<input
					id="email"
					type="email"
					value={draft.email}
					onChange={(e) => onChange("email", e.target.value)}
					className={inputClass(!!errors.email)}
					placeholder="email@example.com"
					aria-invalid={!!errors.email}
				/>
				{errors.email && (
					<p className="mt-1 text-xs text-danger-600" role="alert">
						{errors.email}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="phone"
					className="block text-sm font-medium text-ink-900 mb-1"
				>
					Số điện thoại <span className="text-danger-600">*</span>
				</label>
				<input
					id="phone"
					type="tel"
					value={draft.phone}
					onChange={(e) => onChange("phone", e.target.value)}
					className={inputClass(!!errors.phone)}
					placeholder="0901234567"
					aria-invalid={!!errors.phone}
				/>
				{errors.phone && (
					<p className="mt-1 text-xs text-danger-600" role="alert">
						{errors.phone}
					</p>
				)}
			</div>

			<div className="flex gap-2 pt-2 border-t border-ink-200">
				<button
					onClick={onSave}
					className="inline-flex items-center gap-1.5 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
				>
					<Save className="w-4 h-4" aria-hidden="true" />
					Lưu thay đổi
				</button>
				<button
					onClick={onCancel}
					className="inline-flex items-center gap-1.5 px-4 h-10 bg-white text-ink-700 border border-ink-300 text-sm font-semibold rounded-md hover:bg-ink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
				>
					<X className="w-4 h-4" aria-hidden="true" />
					Hủy
				</button>
			</div>
		</div>
	);
}
