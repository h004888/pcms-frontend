import { AdminHomeBannerForm } from '@/features/admin/home-banners/form';
import { listAdminBanners } from '@/lib/api/home';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Load banner từ server-side. Fallback nếu fail.
  let initial: any = { id };
  try {
    const res = await listAdminBanners({ size: 100 });
    const found = res.content.find((b) => b.id === id);
    if (found) {
      initial = {
        id: found.id,
        title: found.title,
        imageUrl: found.imageUrl,
        linkUrl: found.linkUrl,
        sortOrder: found.sortOrder,
        status: found.status === 'DELETED' ? 'INACTIVE' : found.status,
      };
    }
  } catch {
    // ignore - form sẽ rỗng
  }
  return <AdminHomeBannerForm initial={initial} />;
}
