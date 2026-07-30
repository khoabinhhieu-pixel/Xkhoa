"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const shippingSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại"),
  email: z.string().trim().email("Email không hợp lệ"),
  address: z.string().trim().min(1, "Vui lòng nhập địa chỉ"),
  city: z.string().trim().min(1, "Vui lòng nhập tỉnh/thành phố"),
  zip: z.string().trim().optional(),
});

const placeOrderSchema = z.object({
  items: z
    .array(z.object({ id: z.string(), quantity: z.number().int().min(1) }))
    .min(1, "Giỏ hàng đang trống"),
  shipping: shippingSchema,
  paymentMethod: z.enum(["cod", "bank", "card", "wallet"]),
});

export type PlaceOrderResult =
  | { success: true; orderNumber: string }
  | { success: false; error: string };

const SHIPPING_FEE = 30000;

function generateOrderNumber() {
  return `FS${Math.floor(100000 + Math.random() * 900000)}`;
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function placeOrderAction(input: {
  items: { id: string; quantity: number }[];
  shipping: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    zip?: string;
  };
  paymentMethod: string;
}): Promise<PlaceOrderResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Vui lòng đăng nhập để đặt hàng" };
  }
  const userId = session.user.id;

  const parsed = placeOrderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ",
    };
  }

  const productIds = parsed.data.items.map((item) => item.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const orderItemsData: {
    productId: string;
    name: string;
    price: number;
    tone: number;
    color: string;
    quantity: number;
  }[] = [];

  for (const item of parsed.data.items) {
    const product = productMap.get(item.id);
    if (!product) {
      return { success: false, error: "Một số sản phẩm không còn tồn tại" };
    }
    subtotal += product.price * item.quantity;
    orderItemsData.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      tone: product.tone,
      color: product.colors[0] ?? "#1a1a1a",
      quantity: item.quantity,
    });
  }

  const shippingFee = SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const paymentMethodEnum = parsed.data.paymentMethod.toUpperCase() as
    | "COD"
    | "BANK"
    | "CARD"
    | "WALLET";

  try {
    const orderNumber = await prisma.$transaction(async (tx) => {
      if (paymentMethodEnum === "WALLET") {
        const updated = await tx.user.updateMany({
          where: { id: userId, walletBalance: { gte: total } },
          data: { walletBalance: { decrement: total } },
        });
        if (updated.count === 0) {
          throw new Error("INSUFFICIENT_BALANCE");
        }
      }

      let createdOrderNumber: string | null = null;
      let createdOrderId: string | null = null;

      for (let attempt = 0; attempt < 5 && !createdOrderNumber; attempt += 1) {
        const candidate = generateOrderNumber();
        try {
          const order = await tx.order.create({
            data: {
              orderNumber: candidate,
              userId,
              name: parsed.data.shipping.name,
              phone: parsed.data.shipping.phone,
              email: parsed.data.shipping.email,
              address: parsed.data.shipping.address,
              city: parsed.data.shipping.city,
              zip: parsed.data.shipping.zip || null,
              paymentMethod: paymentMethodEnum,
              subtotal,
              shippingFee,
              total,
              items: { create: orderItemsData },
            },
          });
          createdOrderNumber = order.orderNumber;
          createdOrderId = order.id;
        } catch (error) {
          if (isUniqueConstraintError(error)) continue;
          throw error;
        }
      }

      if (!createdOrderNumber || !createdOrderId) {
        throw new Error("Không thể tạo mã đơn hàng, vui lòng thử lại.");
      }

      if (paymentMethodEnum === "WALLET") {
        const user = await tx.user.findUniqueOrThrow({
          where: { id: userId },
        });
        await tx.walletTransaction.create({
          data: {
            userId,
            type: "ORDER_PAYMENT",
            amount: -total,
            balanceAfter: user.walletBalance,
            orderId: createdOrderId,
            description: `Thanh toán đơn hàng #${createdOrderNumber}`,
          },
        });
      }

      return createdOrderNumber;
    });

    return { success: true, orderNumber };
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_BALANCE") {
      return {
        success: false,
        error: "Số dư ví không đủ để thanh toán đơn hàng này",
      };
    }
    throw error;
  }
}
