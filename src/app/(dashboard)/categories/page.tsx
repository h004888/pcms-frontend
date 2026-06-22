"use client";

// =====================================================
// PCMS - Categories List Page (SCR-CAT-LIST) - UC04
// Hoàn thiện: dùng CategoryForm component riêng (P1.8)
// =====================================================

import { DashboardLayout } from "@/components/Layout";
import { ListPage } from "@/components/shared/ListPage";
import type { Column } from "@/components/ui";
import type { Category } from "@/features/categories/types";
import { CategoryForm } from "@/features/categories";
import { formatDateTime } from "@/lib/utils";
import { apiClient, getErrorMessage } from "@/lib/api";
import toast from "react-hot-toast";
import { Trash2, Tag as TagIcon } from "lucide-react";
import { useState } from "react";

export default function CategoriesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDelete = async (c: Category) => {
    if (!confirm(`Xóa danh mục "${c.name}"?`)) return;
    try {
      await apiClient.delete(`/categories/${c.id}`);
      toast.success("Đã xóa danh mục");
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const columns: Column<Category>[] = [
    {
      key: "code",
      header: "Mã",
      width: "120px",
      render: (c) => (
        <span className="font-mono text-xs px-1.5 py-0.5 bg-ink-50 rounded text-ink-700">
          {c.code || "—"}
        </span>
      ),
    },
    {
      key: "name",
      header: "Tên danh mục",
      render: (c) => (
        <div className="flex items-center gap-2">
          <TagIcon className="w-4 h-4 text-accent-600" aria-hidden="true" />
          <span className="font-medium text-ink-900">{c.name}</span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Mô tả",
      render: (c) => (
        <span className="text-sm text-ink-600 line-clamp-1">
          {c.description || "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      width: "180px",
      render: (c) => (
        <span className="text-xs text-ink-500">
          {formatDateTime(c.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <ListPage<Category>
        key={refreshKey}
        title="Quản lý danh mục thuốc"
        subtitle="UC04 — Phân loại thuốc theo nhóm dược lý"
        endpoint="/categories"
        columns={columns}
        searchPlaceholder="Tìm theo tên danh mục..."
        addButtonLabel="Thêm danh mục mới"
        renderForm={({ open, onClose, item, refetch }) => (
          <CategoryForm
            open={open}
            onClose={onClose}
            item={item ?? undefined}
            onSuccess={refetch}
          />
        )}
        customActions={(c) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(c);
            }}
            className="inline-flex items-center justify-center w-7 h-7 text-ink-500 hover:text-danger-700 hover:bg-danger-50 rounded transition-colors"
            title="Xóa"
            aria-label={`Xóa danh mục ${c.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      />
    </DashboardLayout>
  );
}
