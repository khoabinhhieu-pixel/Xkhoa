import Link from "next/link";
import { requireUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import { signOut } from "@/auth";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

export default async function AccountPage() {
  const sessionUser = await requireUser("/account");
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
    select: { fullName: true, email: true, walletBalance: true, role: true },
  });

  return (
    <div className="mx-auto w-full max-w-(--container-page) px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <SectionLabel text="Tài khoản" />
        <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
          {user.fullName}
        </h1>
        <p className="mt-2 text-sm text-fg-muted">{user.email}</p>
      </Reveal>

      <Reveal delay={0.05} className="mt-10 grid max-w-xl gap-6 sm:grid-cols-2">
        <div className="border border-border p-6">
          <p className="tracked-label text-[10px] text-fg-muted">Số dư ví</p>
          <p className="mt-2 text-xl text-fg">
            {formatVND(user.walletBalance)}
          </p>
          <Link
            href="/account/wallet"
            className="mt-3 inline-block text-xs text-fg underline underline-offset-4"
          >
            Quản lý ví
          </Link>
        </div>
        {user.role === "ADMIN" ? (
          <div className="border border-border p-6">
            <p className="tracked-label text-[10px] text-fg-muted">
              Quản trị
            </p>
            <p className="mt-2 text-sm text-fg-muted">
              Bạn có quyền quản trị viên.
            </p>
            <Link
              href="/admin/products"
              className="mt-3 inline-block text-xs text-fg underline underline-offset-4"
            >
              Vào trang quản trị
            </Link>
          </div>
        ) : null}
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit" variant="outline">
            Đăng xuất
          </Button>
        </form>
      </Reveal>
    </div>
  );
}
