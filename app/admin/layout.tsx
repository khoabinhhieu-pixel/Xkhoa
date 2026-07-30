import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border">
        <nav className="tracked-label mx-auto flex max-w-(--container-page) items-center gap-6 px-5 py-4 text-[11px] md:px-10">
          <span className="text-fg-muted">Quản trị</span>
          <Link href="/admin/products" className="text-fg hover:text-fg-muted">
            Sản phẩm
          </Link>
          <Link href="/admin/users" className="text-fg hover:text-fg-muted">
            Tài khoản
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
