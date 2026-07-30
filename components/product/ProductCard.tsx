import Link from "next/link";
import ProductImage from "@/components/ui/ProductImage";
import AddToCartButton from "@/components/product/AddToCartButton";
import { formatVND } from "@/lib/format";
import type { Product } from "@/lib/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <ProductImage
            src={product.images[0]}
            tone={product.tone}
            alt={product.name}
            className="absolute inset-0"
          />
          <ProductImage
            src={product.images[1] ?? product.images[0]}
            tone={product.tone + 1}
            alt={product.name}
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <span className="tracked-label absolute right-3 top-3 rounded-sm bg-bg/70 px-2 py-1 text-[9px] text-fg-muted">
            {product.category}
          </span>
        </div>
        <div className="mt-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm text-fg">{product.name}</h3>
            <div className="mt-1.5 flex gap-1.5">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="h-3 w-3 rounded-full border border-border-strong"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <span className="text-sm text-fg-muted">
            {formatVND(product.price)}
          </span>
        </div>
      </Link>
      <AddToCartButton product={product} className="mt-3 w-full" />
    </div>
  );
}
