import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ProductImage from "@/components/ui/ProductImage";
import { ButtonLink } from "@/components/ui/Button";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-(--container-page) px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel text="Quản lý sản phẩm" />
            <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
              {products.length} sản phẩm
            </h1>
          </div>
          <ButtonLink href="/admin/products/new" variant="solid">
            Thêm sản phẩm
          </ButtonLink>
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-10">
        <ul className="divide-y divide-border border-y border-border">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div className="flex min-w-0 items-center gap-4">
                <ProductImage
                  src={product.images[0]}
                  tone={product.tone}
                  alt={product.name}
                  className="h-14 w-12 shrink-0"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm text-fg">{product.name}</p>
                  <p className="mt-1 text-xs text-fg-muted">
                    {product.category} · {product.gender} ·{" "}
                    {formatVND(product.price)}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="text-xs text-fg underline underline-offset-4"
                >
                  Sửa
                </Link>
                <DeleteProductButton id={product.id} name={product.name} />
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
