import "server-only";
import { prisma } from "@/lib/prisma";

export function getProducts(options?: { gender?: string }) {
  const gender = options?.gender;
  if (gender === "nam" || gender === "nu") {
    return prisma.product.findMany({
      where: { OR: [{ gender }, { gender: "unisex" }] },
      orderBy: { createdAt: "desc" },
    });
  }
  return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
}

export function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export function getNewArrivals(limit: number) {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
