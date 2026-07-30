"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/ui/Field";
import Textarea from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import ProductImage from "@/components/ui/ProductImage";
import { CloseIcon } from "@/components/ui/Icons";
import {
  createProductAction,
  updateProductAction,
} from "@/lib/actions/products-admin";
import type { Product } from "@/lib/data/products";

const GENDERS = [
  { value: "unisex", label: "Unisex" },
  { value: "nam", label: "Nam" },
  { value: "nu", label: "Nữ" },
];

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keptImages, setKeptImages] = useState<string[]>(
    product?.images ?? [],
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    let result;
    try {
      result = isEdit
        ? await updateProductAction(product.id, formData)
        : await createProductAction(formData);
    } catch {
      setSubmitting(false);
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
      return;
    }

    setSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field
        label="Mã sản phẩm (slug)"
        name="id"
        required
        disabled={isEdit}
        defaultValue={product?.id}
        placeholder="wool-overcoat"
      />
      <Field
        label="Tên sản phẩm"
        name="name"
        required
        defaultValue={product?.name}
        placeholder="Áo khoác dạ Wool Overcoat"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Giá (VNĐ)"
          type="number"
          name="price"
          required
          min={1000}
          step={1000}
          defaultValue={product?.price}
          placeholder="1290000"
        />
        <Field
          label="Danh mục"
          name="category"
          required
          defaultValue={product?.category}
          placeholder="Áo khoác"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="tracked-label text-[10px] text-fg-muted">
            Giới tính
          </span>
          <select
            name="gender"
            defaultValue={product?.gender ?? "unisex"}
            className="w-full border-b border-border-strong bg-transparent py-2 text-sm text-fg focus:border-fg focus:outline-none"
          >
            {GENDERS.map((g) => (
              <option key={g.value} value={g.value} className="bg-bg text-fg">
                {g.label}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Tone ảnh (0-5)"
          type="number"
          name="tone"
          min={0}
          max={5}
          required
          defaultValue={product?.tone ?? 0}
        />
      </div>
      <Field
        label="Màu sắc (mã hex, cách nhau bởi dấu phẩy)"
        name="colors"
        required
        defaultValue={product?.colors.join(", ")}
        placeholder="#1a1a1a, #4a4436"
      />

      {isEdit && keptImages.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="tracked-label text-[10px] text-fg-muted">
            Ảnh hiện tại
          </span>
          <div className="flex flex-wrap gap-3">
            {keptImages.map((url) => (
              <div key={url} className="relative h-20 w-16 shrink-0">
                <ProductImage
                  src={url}
                  tone={product?.tone ?? 0}
                  alt=""
                  className="h-full w-full"
                />
                <input type="hidden" name="keepImages" value={url} />
                <button
                  type="button"
                  onClick={() =>
                    setKeptImages((prev) => prev.filter((u) => u !== url))
                  }
                  aria-label="Xoá ảnh"
                  className="absolute -right-1.5 -top-1.5 bg-bg text-fg-muted transition-colors hover:text-fg"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <label className="flex flex-col gap-2">
        <span className="tracked-label text-[10px] text-fg-muted">
          Tải ảnh lên (JPG/PNG/WEBP/GIF, tối đa 5MB mỗi ảnh)
        </span>
        <input
          type="file"
          name="images"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="text-sm text-fg-muted file:mr-4 file:border file:border-border-strong file:bg-transparent file:px-3 file:py-1.5 file:text-xs file:text-fg"
        />
      </label>

      <Textarea
        label="Hoặc dán URL ảnh (mỗi dòng 1 URL)"
        name="imageUrls"
        placeholder={"https://images.unsplash.com/...\nhttps://..."}
      />

      <Textarea
        label="Mô tả"
        name="description"
        required
        defaultValue={product?.description}
        placeholder="Mô tả ngắn về sản phẩm..."
      />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <Button
        type="submit"
        variant="solid"
        disabled={submitting}
        className="w-fit"
      >
        {submitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo sản phẩm"}
      </Button>
    </form>
  );
}
