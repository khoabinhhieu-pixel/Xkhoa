"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "@/lib/stores/ui-store";
import { useCartStore } from "@/lib/stores/cart-store";
import type { Product } from "@/lib/data/products";
import { formatVND } from "@/lib/format";
import ProductImage from "@/components/ui/ProductImage";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { IconButton } from "@/components/ui/Button";

export default function SearchOverlay() {
  const searchOpen = useUIStore((s) => s.searchOpen);
  const closeSearch = useUIStore((s) => s.closeSearch);
  const openCart = useUIStore((s) => s.openCart);
  const addItem = useCartStore((s) => s.addItem);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    if (products.length === 0) {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data: Product[]) => setProducts(data))
        .catch(() => setProducts([]));
    }
    return () => clearTimeout(t);
  }, [searchOpen, products.length]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeSearch]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query, products]);

  return (
    <AnimatePresence onExitComplete={() => setQuery("")}>
      {searchOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-bg/95 backdrop-blur"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
        >
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl px-5 pt-24 md:pt-32"
          >
            <div className="flex items-center gap-3 border-b border-border-strong pb-3">
              <SearchIcon className="h-5 w-5 text-fg-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm áo khoác, sơ mi, quần..."
                className="w-full bg-transparent text-lg text-fg placeholder:text-fg-muted focus:outline-none"
              />
              <IconButton
                type="button"
                onClick={closeSearch}
                aria-label="Đóng tìm kiếm"
                className="text-fg-muted hover:text-fg"
              >
                <CloseIcon />
              </IconButton>
            </div>

            <div className="mt-6">
              {query.trim() && results.length === 0 ? (
                <p className="text-sm text-fg-muted">
                  Không tìm thấy sản phẩm phù hợp với &quot;{query}&quot;.
                </p>
              ) : null}

              <ul className="flex flex-col divide-y divide-border">
                {results.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center gap-4 py-4"
                  >
                    <Link
                      href={`/products/${product.id}`}
                      onClick={closeSearch}
                      className="flex min-w-0 flex-1 items-center gap-4"
                    >
                      <ProductImage
                        src={product.images[0]}
                        tone={product.tone}
                        alt={product.name}
                        className="h-16 w-14 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-fg">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs text-fg-muted">
                          {product.category} · {formatVND(product.price)}
                        </p>
                      </div>
                    </Link>
                    <IconButton
                      type="button"
                      onClick={() => {
                        addItem(
                          {
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            tone: product.tone,
                            color: product.colors[0],
                          },
                          1,
                        );
                        closeSearch();
                        openCart();
                      }}
                      className="tracked-label shrink-0 border border-fg px-3 py-2 text-[10px] text-fg transition-colors hover:bg-fg hover:text-bg"
                    >
                      Thêm vào giỏ
                    </IconButton>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
