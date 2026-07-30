import "server-only";
import { prisma } from "@/lib/prisma";

export function getReviewsForProduct(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { fullName: true } } },
  });
}

export async function getProductRatingSummary(productId: string) {
  const result = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });
  return {
    average: result._avg.rating ?? 0,
    count: result._count,
  };
}
