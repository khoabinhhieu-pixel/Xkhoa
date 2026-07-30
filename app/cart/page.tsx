"use client";

import { useCartStore } from "@/lib/stores/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatVND } from "@/lib/format";
import ProductImage from "@/components/ui/ProductImage";
import Reveal from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon, CloseIcon } from "@/components/ui/Icons";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const mounted = useMounted();
  const cartItems = mounted ? items : [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (mounted && cartItems.length === 0) {
    return (
      <div className="mx-auto flex max-w-(--container-page) flex-1 flex-col items-center justify-center gap-6 px-5 py-32 text-center">
        <SectionHeading />
        <p className="text-sm text-fg-muted">
          Giỏ hàng của bạn đang trống.
        </p>
        <ButtonLink href="/#new-arrivals" variant="outline">
          Khám phá sản phẩm
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-(--container-page) px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <SectionHeading />
      </Reveal>

      <div className="mt-10 grid gap-12 md:grid-cols-[1fr_320px]">
        <Reveal>
          <ul className="divide-y divide-border border-y border-border">
            {cartItems.map((item) => (
              <li key={item.id} className="flex gap-5 py-6">
                <ProductImage
                  src={item.image}
                  tone={item.tone}
                  alt={item.name}
                  className="h-32 w-24 shrink-0"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-fg">{item.name}</p>
                      <span
                        className="mt-2 inline-block h-3 w-3 rounded-full border border-border-strong"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label="Xoá sản phẩm"
                      className="text-fg-muted transition-colors hover:text-fg"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-border-strong">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1.5 text-fg-muted transition-colors hover:text-fg"
                        aria-label="Giảm số lượng"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm text-fg">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1.5 text-fg-muted transition-colors hover:text-fg"
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-fg">
                      {formatVND(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="border border-border p-6">
            <h2 className="tracked-label text-[11px] text-fg-muted">
              Tóm tắt đơn hàng
            </h2>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-fg-muted">Tạm tính</span>
              <span className="text-fg">{formatVND(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-fg-muted">Vận chuyển</span>
              <span className="text-fg">Tính ở bước sau</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="text-fg">Tổng cộng</span>
              <span className="text-base text-fg">{formatVND(subtotal)}</span>
            </div>
            <ButtonLink
              href="/checkout"
              variant="solid"
              className="mt-6 w-full"
            >
              Tiến hành thanh toán
            </ButtonLink>
            <ButtonLink
              href="/#new-arrivals"
              variant="text"
              className="mt-4 mx-auto"
            >
              Tiếp tục mua sắm
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function SectionHeading() {
  return (
    <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
      Giỏ hàng
    </h1>
  );
}
