import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import { requireAdmin } from "@/lib/auth/require-admin";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import DeleteUserButton from "@/components/admin/DeleteUserButton";

const ROLE_LABEL: Record<string, string> = {
  CUSTOMER: "Khách hàng",
  ADMIN: "Quản trị viên",
};

export default async function AdminUsersPage() {
  const currentUser = await requireAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-(--container-page) px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <SectionLabel text="Quản lý tài khoản" />
        <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
          {users.length} tài khoản
        </h1>
      </Reveal>

      <Reveal delay={0.05} className="mt-10">
        <ul className="divide-y divide-border border-y border-border">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-fg">
                  {user.fullName}
                  {user.id === currentUser.id ? (
                    <span className="ml-2 text-xs text-fg-muted">(bạn)</span>
                  ) : null}
                </p>
                <p className="mt-1 truncate text-xs text-fg-muted">
                  {user.email} · {ROLE_LABEL[user.role]} ·{" "}
                  {formatVND(user.walletBalance)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/admin/users/${user.id}/edit`}
                  className="text-xs text-fg underline underline-offset-4"
                >
                  Sửa
                </Link>
                {user.id === currentUser.id ? null : (
                  <DeleteUserButton id={user.id} name={user.fullName} />
                )}
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
