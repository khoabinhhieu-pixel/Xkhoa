import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const qaOrderFilter = {
    items: { some: { productId: { startsWith: "qa-test-product" } } },
  };

  const walletTx = await prisma.walletTransaction.deleteMany({
    where: { order: qaOrderFilter },
  });
  const qaOrders = await prisma.order.deleteMany({ where: qaOrderFilter });
  const products = await prisma.product.deleteMany({
    where: { id: { startsWith: "qa-test-product" } },
  });
  const users = await prisma.user.deleteMany({
    where: { email: { startsWith: "qa-", endsWith: "@fashionshop.vn" } },
  });

  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@fashionshop.vn" },
  });
  if (demoUser) {
    const agg = await prisma.walletTransaction.aggregate({
      where: { userId: demoUser.id },
      _sum: { amount: true },
    });
    const reconciledBalance = agg._sum.amount ?? 0;
    if (reconciledBalance !== demoUser.walletBalance) {
      await prisma.user.update({
        where: { id: demoUser.id },
        data: { walletBalance: reconciledBalance },
      });
      console.log(
        `Reconciled demo wallet balance: ${demoUser.walletBalance} -> ${reconciledBalance}`,
      );
    }
  }

  console.log(
    `Deleted ${walletTx.count} wallet tx, ${qaOrders.count} QA order(s), ${products.count} QA product(s), ${users.count} QA user(s).`,
  );
}

main().finally(() => prisma.$disconnect());
