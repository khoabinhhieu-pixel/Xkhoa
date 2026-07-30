"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/actions/auth";

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1, "Chọn số sao").max(5),
  comment: z.string().trim().min(1, "Vui lòng nhập nội dung đánh giá"),
});

export async function submitReviewAction(input: {
  productId: string;
  rating: number;
  comment: string;
}): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Vui lòng đăng nhập để đánh giá" };
  }

  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ",
    };
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
  });
  if (!product) {
    return { success: false, error: "Không tìm thấy sản phẩm" };
  }

  await prisma.review.upsert({
    where: {
      productId_userId: {
        productId: parsed.data.productId,
        userId: session.user.id,
      },
    },
    create: {
      productId: parsed.data.productId,
      userId: session.user.id,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
    update: {
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
  });

  revalidatePath(`/products/${parsed.data.productId}`);

  return { success: true };
}
