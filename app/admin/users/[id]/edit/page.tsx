import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import UserForm from "@/components/admin/UserForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await requireAdmin();
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <SectionLabel text="Chỉnh sửa tài khoản" />
        <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
          {user.fullName}
        </h1>
      </Reveal>
      <Reveal delay={0.05} className="mt-10">
        <UserForm user={user} isSelf={user.id === currentUser.id} />
      </Reveal>
    </div>
  );
}
