"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/lib/stores/cart-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatVND } from "@/lib/format";
import ProductImage from "@/components/ui/ProductImage";
import { CloseIcon } from "@/components/ui/Icons";
import { Button, ButtonLink, IconButton } from "@/components/ui/Button";

export default function CartDrawer() {
  const cartOpen = useUIStore((s) => s.cartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const mounted = useMounted();

  const cartItems = mounted ? items : [];
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <AnimatePresence>
      {cartOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-bg/70"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-bg"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="tracked-label text-sm">
                Giỏ hàng {cartItems.length > 0 ? `(${cartItems.length})` : ""}
              </h2>
              <IconButton
                type="button"
                onClick={closeCart}
                aria-label="Đóng giỏ hàng"
                className="text-fg-muted hover:text-fg"
              >
                <CloseIcon />
              </IconButton>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-sm text-fg-muted">
                  Giỏ hàng của bạn đang trống.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeCart}
                >
                  Tiếp tục mua sắm
                </Button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto divide-y divide-border px-6">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex gap-4 py-5">
                      <ProductImage
                        src={item.image}
                        tone={item.tone}
                        alt={item.name}
                        className="h-24 w-20 shrink-0"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-fg">{item.name}</p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label="Xoá sản phẩm"
                            className="text-fg-muted transition-colors hover:text-fg"
                          >
                            <CloseIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-fg-muted">
                          {formatVND(item.price)}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex items-center border border-border-strong">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-2.5 py-1 text-fg-muted transition-colors hover:text-fg"
                              aria-label="Giảm số lượng"
                            >
                              −
                            </button>
                            <span className="min-w-[1.5rem] text-center text-xs text-fg">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-2.5 py-1 text-fg-muted transition-colors hover:text-fg"
                              aria-label="Tăng số lượng"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border px-6 py-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-fg-muted">Tạm tính</span>
                    <span className="text-fg">{formatVND(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-fg-muted">
                    Phí vận chuyển tính ở bước thanh toán.
                  </p>
                  <ButtonLink
                    href="/checkout"
                    variant="solid"
                    onClick={closeCart}
                    className="mt-5 w-full"
                  >
                    Tiến hành thanh toán
                  </ButtonLink>
                  <ButtonLink
                    href="/cart"
                    variant="text"
                    onClick={closeCart}
                    className="mt-4 mx-auto"
                  >
                    Xem giỏ hàng đầy đủ
                  </ButtonLink>
                </div>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
