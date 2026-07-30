"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/actions/auth";
import {
  saveUploadedImages,
  deleteUploadedImages,
  MAX_IMAGES_PER_PRODUCT,
  MAX_IMAGE_BYTES,
  ACCEPTED_IMAGE_TYPES,
} from "@/lib/storage/product-images";

const productSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mã sản phẩm (slug)")
    .regex(/^[a-z0-9-]+$/, "Chỉ dùng chữ thường, số và dấu gạch ngang"),
  name: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm"),
  price: z.coerce.number().int().min(1000, "Giá không hợp lệ"),
  category: z.string().trim().min(1, "Vui lòng nhập danh mục"),
  gender: z.enum(["nam", "nu", "unisex"]),
  tone: z.coerce.number().int().min(0).max(5),
  colors: z.string().trim().min(1, "Vui lòng nhập ít nhất 1 màu (hex, cách nhau bởi dấu phẩy)"),
  description: z.string().trim().min(1, "Vui lòng nhập mô tả"),
});

const imageFileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= MAX_IMAGE_BYTES, "Mỗi ảnh tối đa 5MB")
  .refine(
    (f) =>
      ACCEPTED_IMAGE_TYPES.includes(
        f.type as (typeof ACCEPTED_IMAGE_TYPES)[number],
      ),
    "Chỉ chấp nhận ảnh JPG, PNG, WEBP hoặc GIF",
  );

const imageUrlSchema = z.string().trim().url("URL ảnh không hợp lệ");

function parseColors(raw: string): string[] {
  return raw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

function isErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === code
  );
}

function fieldsFromFormData(formData: FormData) {
  return {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    price: String(formData.get("price") ?? ""),
    category: String(formData.get("category") ?? ""),
    gender: String(formData.get("gender") ?? ""),
    tone: String(formData.get("tone") ?? ""),
    colors: String(formData.get("colors") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}

function extractNewFiles(formData: FormData): File[] {
  return formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

function extractNewImageUrls(formData: FormData): string[] {
  return String(formData.get("imageUrls") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function validateImageInputs(
  files: File[],
  urls: string[],
): { success: true; urls: string[] } | { success: false; error: string } {
  for (const file of files) {
    const result = imageFileSchema.safeParse(file);
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message ?? "Ảnh không hợp lệ" };
    }
  }
  for (const url of urls) {
    const result = imageUrlSchema.safeParse(url);
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message ?? "URL ảnh không hợp lệ" };
    }
  }
  return { success: true, urls };
}

export async function createProductAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(fieldsFromFormData(formData));
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ",
    };
  }

  const newFiles = extractNewFiles(formData);
  const newUrls = extractNewImageUrls(formData);
  const imageValidation = validateImageInputs(newFiles, newUrls);
  if (!imageValidation.success) {
    return { success: false, error: imageValidation.error };
  }
  if (newFiles.length + newUrls.length > MAX_IMAGES_PER_PRODUCT) {
    return {
      success: false,
      error: `Tối đa ${MAX_IMAGES_PER_PRODUCT} ảnh mỗi sản phẩm`,
    };
  }

  const existing = await prisma.product.findUnique({
    where: { id: parsed.data.id },
    select: { id: true },
  });
  if (existing) {
    return { success: false, error: "Mã sản phẩm này đã tồn tại" };
  }

  const uploadedPaths = await saveUploadedImages(newFiles);

  try {
    await prisma.product.create({
      data: {
        id: parsed.data.id,
        name: parsed.data.name,
        price: parsed.data.price,
        category: parsed.data.category,
        gender: parsed.data.gender,
        tone: parsed.data.tone,
        colors: parseColors(parsed.data.colors),
        images: [...uploadedPaths, ...newUrls],
        description: parsed.data.description,
      },
    });
  } catch (error) {
    await deleteUploadedImages(uploadedPaths);
    if (isErrorCode(error, "P2002")) {
      return { success: false, error: "Mã sản phẩm này đã tồn tại" };
    }
    throw error;
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");

  return { success: true };
}

const updateSchema = productSchema.omit({ id: true });

export async function updateProductAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = updateSchema.safeParse(fieldsFromFormData(formData));
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ",
    };
  }

  const newFiles = extractNewFiles(formData);
  const newUrls = extractNewImageUrls(formData);
  const keepImages = formData.getAll("keepImages").map(String);
  const imageValidation = validateImageInputs(newFiles, newUrls);
  if (!imageValidation.success) {
    return { success: false, error: imageValidation.error };
  }
  if (keepImages.length + newFiles.length + newUrls.length > MAX_IMAGES_PER_PRODUCT) {
    return {
      success: false,
      error: `Tối đa ${MAX_IMAGES_PER_PRODUCT} ảnh mỗi sản phẩm`,
    };
  }

  const current = await prisma.product.findUnique({
    where: { id },
    select: { images: true },
  });

  const uploadedPaths = await saveUploadedImages(newFiles);
  const finalImages = [...keepImages, ...uploadedPaths, ...newUrls];

  await prisma.product.update({
    where: { id },
    data: {
      name: parsed.data.name,
      price: parsed.data.price,
      category: parsed.data.category,
      gender: parsed.data.gender,
      tone: parsed.data.tone,
      colors: parseColors(parsed.data.colors),
      images: finalImages,
      description: parsed.data.description,
    },
  });

  const removedImages = (current?.images ?? []).filter(
    (url) => !keepImages.includes(url),
  );
  await deleteUploadedImages(removedImages);

  revalidatePath("/admin/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/products");
  revalidatePath("/");

  return { success: true };
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.product.findUnique({
    where: { id },
    select: { images: true },
  });

  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    if (isErrorCode(error, "P2003")) {
      return {
        success: false,
        error: "Không thể xoá sản phẩm đã có trong đơn hàng.",
      };
    }
    throw error;
  }

  if (existing) {
    await deleteUploadedImages(existing.images);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");

  return { success: true };
}
