"use client";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/stores/cart-store";
import { useUIStore } from "@/lib/stores/ui-store";
import type { Product } from "@/lib/data/products";

export default function AddToCartButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          tone: product.tone,
          color: product.colors[0],
          image: product.images[0],
        });
        openCart();
      }}
      className={className}
    >
      Thêm vào giỏ
    </Button>
  );
}
