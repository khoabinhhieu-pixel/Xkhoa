import { requireUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default async function CheckoutPage() {
  const sessionUser = await requireUser("/checkout");
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
    select: { walletBalance: true },
  });

  return <CheckoutForm walletBalance={user.walletBalance} />;
}
