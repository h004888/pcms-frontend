// =====================================================
// PCMS - Menu Configuration with Role-Based Access
// Based on SRS §3.1.3 Screen Authorization matrix
// =====================================================

import {
	LayoutDashboard,
	Users,
	Building2,
	Pill,
	Tag,
	Truck,
	Boxes,
	UserCircle2,
	ShoppingCart,
	FileText,
	Bell,
	BarChart3,
	Search,
	type LucideIcon,
} from "lucide-react";
import { Role } from "@/types";

/** Roles constants — dùng để gom nhóm role names, tránh duplicate string literals. */
const ALL_STAFF: Role[] = ["ADMIN", "CEO", "BRANCH_MANAGER", "PHARMACIST"];
const ADMIN_CEO: Role[] = ["ADMIN", "CEO"];
const CLINICAL: Role[] = ["ADMIN", "CEO", "PHARMACIST"];

export interface MenuItem {
	label: string;
	href: string;
	icon: LucideIcon;
	/** Roles allowed to see this menu item. Empty = all roles */
	allowedRoles?: Role[];
	/** Optional badge (e.g. unread notifications count) hiển thị bên phải nav item */
	badge?: number | string;
}

export const MENU_GROUPS: { title: string; items: MenuItem[] }[] = [
	{
		title: "Tổng quan",
		items: [
			{ label: "Dashboard", href: "/home", icon: LayoutDashboard },
			{
				label: "Tìm kiếm thuốc",
				href: "/search",
				icon: Search,
				allowedRoles: [
					"ADMIN",
					"CEO",
					"BRANCH_MANAGER",
					"PHARMACIST",
					"CUSTOMER",
				],
			},
		],
	},
	{
		title: "Quản lý",
		items: [
			{
				label: "Người dùng",
				href: "/users",
				icon: Users,
				allowedRoles: ADMIN_CEO,
			},
			{
				label: "Chi nhánh",
				href: "/branches",
				icon: Building2,
				allowedRoles: ADMIN_CEO,
			},
			{
				label: "Thuốc",
				href: "/medicines",
				icon: Pill,
				allowedRoles: CLINICAL,
			},
			{
				label: "Danh mục thuốc",
				href: "/categories",
				icon: Tag,
				allowedRoles: ADMIN_CEO,
			},
			{
				label: "Nhà cung cấp",
				href: "/suppliers",
				icon: Truck,
				allowedRoles: ADMIN_CEO,
			},
		],
	},
	{
		title: "Vận hành",
		items: [
			{
				label: "Tồn kho",
				href: "/inventory",
				icon: Boxes,
				allowedRoles: ALL_STAFF,
			},
			{
				label: "Khách hàng",
				href: "/customers",
				icon: UserCircle2,
				allowedRoles: CLINICAL,
			},
			{
				label: "Đơn hàng",
				href: "/orders",
				icon: ShoppingCart,
				allowedRoles: [...ALL_STAFF, "CUSTOMER"],
			},
		],
	},
	{
		title: "Khác",
		items: [
			{
				label: "Đơn thuốc",
				href: "/prescriptions",
				icon: FileText,
				allowedRoles: CLINICAL,
			},
			{ label: "Thông báo", href: "/notifications", icon: Bell },
			{
				label: "Báo cáo",
				href: "/reports",
				icon: BarChart3,
				allowedRoles: ALL_STAFF,
			},
		],
	},
];

/**
 * Filter menu items based on user role
 */
export function getMenuForRole(
	role: Role | undefined,
): { title: string; items: MenuItem[] }[] {
	if (!role) return [];
	return MENU_GROUPS.map((group) => ({
		title: group.title,
		items: group.items.filter(
			(item) =>
				!item.allowedRoles ||
				item.allowedRoles.length === 0 ||
				item.allowedRoles.includes(role),
		),
	})).filter((group) => group.items.length > 0);
}
