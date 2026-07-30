"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/actions/auth";

const topUpSchema = z.object({
  amount: z.coerce
    .number()
    .int()
    .min(10000, "Số tiền nạp tối thiểu là 10.000₫")
    .max(50000000, "Số tiền nạp tối đa là 50.000.000₫"),
});

export async function topUpAction(input: { amount: number }): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Vui lòng đăng nhập" };
  }

  const parsed = topUpSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Số tiền không hợp lệ",
    };
  }

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: session.user.id },
      data: { walletBalance: { increment: parsed.data.amount } },
    });

    await tx.walletTransaction.create({
      data: {
        userId: session.user.id,
        type: "TOPUP",
        amount: parsed.data.amount,
        balanceAfter: user.walletBalance,
        description: "Nạp tiền vào ví",
      },
    });
  });

  revalidatePath("/account/wallet");

  return { success: true };
}
