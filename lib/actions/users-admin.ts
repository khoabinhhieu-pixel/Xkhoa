"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/actions/auth";

const userSchema = z.object({
  fullName: z.string().trim().min(1, "Vui lòng nhập họ tên"),
  email: z.string().trim().email("Email không hợp lệ"),
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

function isErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === code
  );
}

export async function updateUserAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const currentUser = await requireAdmin();

  const parsed = userSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ",
    };
  }

  if (id === currentUser.id && parsed.data.role !== "ADMIN") {
    return {
      success: false,
      error: "Không thể tự gỡ quyền admin của chính mình.",
    };
  }

  if (parsed.data.role === "CUSTOMER") {
    const target = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    if (target?.role === "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
      });
      if (adminCount <= 1) {
        return {
          success: false,
          error: "Không thể gỡ quyền admin cuối cùng của hệ thống.",
        };
      }
    }
  }

  try {
    await prisma.user.update({
      where: { id },
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        role: parsed.data.role,
      },
    });
  } catch (error) {
    if (isErrorCode(error, "P2002")) {
      return { success: false, error: "Email này đã được sử dụng." };
    }
    throw error;
  }

  revalidatePath("/admin/users");

  return { success: true };
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  const currentUser = await requireAdmin();

  if (id === currentUser.id) {
    return {
      success: false,
      error: "Không thể tự xoá tài khoản của chính mình.",
    };
  }

  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    if (isErrorCode(error, "P2003")) {
      return {
        success: false,
        error: "Không thể xoá tài khoản đã có đơn hàng hoặc giao dịch ví.",
      };
    }
    throw error;
  }

  revalidatePath("/admin/users");

  return { success: true };
}
