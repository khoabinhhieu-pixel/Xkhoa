import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import { SEED_PRODUCTS, SEED_TESTIMONIALS } from "./seed-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const product of SEED_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      create: product,
      update: product,
    });
  }
  console.log(`Seeded ${SEED_PRODUCTS.length} products`);

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({ data: SEED_TESTIMONIALS });
  console.log(`Seeded ${SEED_TESTIMONIALS.length} testimonials`);

  const demoPasswordHash = await bcrypt.hash("Demo123456", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@fashionshop.vn" },
    update: {},
    create: {
      fullName: "Khách Demo",
      email: "demo@fashionshop.vn",
      passwordHash: demoPasswordHash,
      role: "CUSTOMER",
    },
  });

  const existingTopup = await prisma.walletTransaction.findFirst({
    where: { userId: demoUser.id, type: "TOPUP" },
  });
  if (!existingTopup) {
    const topupAmount = 1000000;
    await prisma.$transaction([
      prisma.user.update({
        where: { id: demoUser.id },
        data: { walletBalance: { increment: topupAmount } },
      }),
      prisma.walletTransaction.create({
        data: {
          userId: demoUser.id,
          type: "TOPUP",
          amount: topupAmount,
          balanceAfter: topupAmount,
          description: "Nạp tiền vào ví (seed demo)",
        },
      }),
    ]);
  }
  console.log("Seeded demo customer: demo@fashionshop.vn / Demo123456");

  const adminPasswordHash = await bcrypt.hash("Admin123456", 10);
  await prisma.user.upsert({
    where: { email: "admin@fashionshop.vn" },
    update: { role: "ADMIN" },
    create: {
      fullName: "Quản trị viên",
      email: "admin@fashionshop.vn",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log("Seeded admin: admin@fashionshop.vn / Admin123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
