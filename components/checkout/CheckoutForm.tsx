"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/lib/stores/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatVND } from "@/lib/format";
import ProductImage from "@/components/ui/ProductImage";
import Field from "@/components/ui/Field";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import { Button, ButtonLink } from "@/components/ui/Button";
import { placeOrderAction } from "@/lib/actions/orders";

const PAYMENT_METHODS = [
  { id: "cod", label: "Thanh toán khi nhận hàng (COD)" },
  { id: "bank", label: "Chuyển khoản ngân hàng" },
  { id: "card", label: "Thẻ tín dụng / ghi nợ" },
  { id: "wallet", label: "Ví Fashion Shop" },
];

export default function CheckoutForm({
  walletBalance,
}: {
  walletBalance: number;
}) {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const mounted = useMounted();
  const cartItems = mounted ? items : [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = subtotal > 0 ? 30000 : 0;
  const total = subtotal + shippingFee;
  const walletInsufficient = total > walletBalance;

  const [payment, setPayment] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (payment === "wallet" && walletInsufficient) {
      setError("Số dư ví không đủ để thanh toán đơn hàng này.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    let result;
    try {
      result = await placeOrderAction({
        items: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
        shipping: {
          name: String(formData.get("name") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          email: String(formData.get("email") ?? ""),
          address: String(formData.get("address") ?? ""),
          city: String(formData.get("city") ?? ""),
          zip: String(formData.get("zip") ?? ""),
        },
        paymentMethod: payment,
      });
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
    setOrderNumber(result.orderNumber);
    clear();
  }

  if (orderNumber) {
    return (
      <div className="mx-auto flex max-w-(--container-page) flex-1 flex-col items-center justify-center gap-4 px-5 py-32 text-center">
        <SectionLabel text="Đặt hàng thành công" align="center" />
        <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
          Cảm ơn bạn đã mua sắm!
        </h1>
        <p className="max-w-md text-sm text-fg-muted">
          Mã đơn hàng của bạn là{" "}
          <span className="text-fg">{orderNumber}</span>.
        </p>
        <ButtonLink href="/" variant="solid" className="mt-4">
          Về trang chủ
        </ButtonLink>
      </div>
    );
  }

  if (mounted && cartItems.length === 0) {
    return (
      <div className="mx-auto flex max-w-(--container-page) flex-1 flex-col items-center justify-center gap-6 px-5 py-32 text-center">
        <h1 className="text-3xl font-medium tracking-tight">Thanh toán</h1>
        <p className="text-sm text-fg-muted">
          Giỏ hàng đang trống, chưa có gì để thanh toán.
        </p>
        <ButtonLink href="/#new-arrivals" variant="outline">
          Khám phá sản phẩm
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-(--container-page) px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
          Thanh toán
        </h1>
      </Reveal>

      <form
        onSubmit={handleSubmit}
        className="mt-10 grid gap-12 md:grid-cols-[1fr_360px]"
      >
        <div className="flex flex-col gap-10">
          <Reveal>
            <h2 className="tracked-label text-[11px] text-fg-muted">
              Thông tin giao hàng
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Họ và tên" name="name" required placeholder="Nguyễn Văn A" />
              <Field
                label="Số điện thoại"
                name="phone"
                type="tel"
                required
                placeholder="09xx xxx xxx"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                wrapperClassName="sm:col-span-2"
                placeholder="ban@email.com"
              />
              <Field
                label="Địa chỉ"
                name="address"
                required
                wrapperClassName="sm:col-span-2"
                placeholder="Số nhà, đường"
              />
              <Field
                label="Tỉnh / Thành phố"
                name="city"
                required
                placeholder="TP. Hồ Chí Minh"
              />
              <Field label="Mã bưu điện" name="zip" placeholder="Tuỳ chọn" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="tracked-label text-[11px] text-fg-muted">
              Phương thức thanh toán
            </h2>
            <div className="mt-5 flex flex-col gap-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 border px-4 py-3 text-sm transition-colors ${
                    payment === method.id
                      ? "border-fg text-fg"
                      : "border-border text-fg-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={payment === method.id}
                    onChange={() => setPayment(method.id)}
                    className="h-3.5 w-3.5 accent-fg"
                  />
                  {method.label}
                </label>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {payment === "cod" ? (
                <motion.p
                  key="cod"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 overflow-hidden text-xs text-fg-muted"
                >
                  Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng.
                </motion.p>
              ) : null}

              {payment === "bank" ? (
                <motion.div
                  key="bank"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 border border-border-strong p-4 text-sm text-fg-muted">
                    <p className="text-fg">Thông tin chuyển khoản</p>
                    <p className="mt-2">
                      Ngân hàng: Vietcombank — CN TP. Hồ Chí Minh
                    </p>
                    <p>Số tài khoản: 0123 456 789</p>
                    <p>Chủ tài khoản: CÔNG TY TNHH FASHION SHOP</p>
                    <p className="mt-2 text-xs">
                      Vui lòng ghi nội dung chuyển khoản là số điện thoại đặt
                      hàng của bạn. Đơn hàng được xử lý sau khi xác nhận
                      thanh toán.
                    </p>
                  </div>
                </motion.div>
              ) : null}

              {payment === "card" ? (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Số thẻ"
                      name="cardNumber"
                      inputMode="numeric"
                      wrapperClassName="sm:col-span-2"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    <Field
                      label="Ngày hết hạn"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      required
                    />
                    <Field
                      label="CVV"
                      name="cardCvv"
                      inputMode="numeric"
                      placeholder="123"
                      required
                    />
                  </div>
                </motion.div>
              ) : null}

              {payment === "wallet" ? (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 border border-border-strong p-4 text-sm text-fg-muted">
                    <p className="text-fg">
                      Số dư ví hiện tại: {formatVND(walletBalance)}
                    </p>
                    {walletInsufficient ? (
                      <p className="mt-2 text-xs text-red-400">
                        Số dư không đủ để thanh toán đơn hàng này ({formatVND(total)}).{" "}
                        <a
                          href="/account/wallet"
                          className="underline underline-offset-4"
                        >
                          Nạp thêm tiền
                        </a>
                        .
                      </p>
                    ) : (
                      <p className="mt-2 text-xs">
                        Số tiền sẽ được trừ trực tiếp từ ví khi đặt hàng.
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="border border-border p-6">
            <h2 className="tracked-label text-[11px] text-fg-muted">
              Đơn hàng của bạn
            </h2>
            <ul className="mt-5 flex flex-col gap-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <ProductImage
                    src={item.image}
                    tone={item.tone}
                    alt={item.name}
                    className="h-16 w-14 shrink-0"
                  />
                  <div className="flex flex-1 items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-fg">{item.name}</p>
                      <p className="mt-1 text-xs text-fg-muted">
                        SL: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs text-fg-muted">
                      {formatVND(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-fg-muted">Tạm tính</span>
                <span className="text-fg">{formatVND(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-muted">Phí vận chuyển</span>
                <span className="text-fg">{formatVND(shippingFee)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="text-fg">Tổng cộng</span>
                <span className="text-base text-fg">{formatVND(total)}</span>
              </div>
            </div>
            {error ? (
              <p className="mt-4 text-xs text-red-400">{error}</p>
            ) : null}
            <Button
              type="submit"
              variant="solid"
              disabled={submitting || (payment === "wallet" && walletInsufficient)}
              className="mt-6 w-full"
            >
              {submitting ? "Đang xử lý..." : "Đặt hàng"}
            </Button>
          </div>
        </Reveal>
      </form>
    </div>
  );
}
