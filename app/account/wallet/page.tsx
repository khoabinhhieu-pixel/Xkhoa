import { requireUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import TopUpForm from "@/components/wallet/TopUpForm";
import TransactionHistoryList from "@/components/wallet/TransactionHistoryList";

export default async function WalletPage() {
  const sessionUser = await requireUser("/account/wallet");

  const [user, transactions] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: sessionUser.id },
      select: { walletBalance: true },
    }),
    prisma.walletTransaction.findMany({
      where: { userId: sessionUser.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto w-full max-w-(--container-page) px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <SectionLabel text="Ví của tôi" />
        <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
          {formatVND(user.walletBalance)}
        </h1>
        <p className="mt-2 text-sm text-fg-muted">Số dư khả dụng</p>
      </Reveal>

      <Reveal delay={0.05} className="mt-10 max-w-md border border-border p-6">
        <h2 className="tracked-label text-[11px] text-fg-muted">
          Nạp tiền vào ví
        </h2>
        <div className="mt-4">
          <TopUpForm />
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <h2 className="tracked-label text-[11px] text-fg-muted">
          Lịch sử giao dịch
        </h2>
        <div className="mt-4">
          <TransactionHistoryList transactions={transactions} />
        </div>
      </Reveal>
    </div>
  );
}
