"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Textarea from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { submitReviewAction } from "@/lib/actions/reviews";

export default function ReviewForm({
  productId,
  isLoggedIn,
}: {
  productId: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!isLoggedIn) {
    return (
      <p className="text-sm text-fg-muted">
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(`/products/${productId}`)}`}
          className="text-fg underline underline-offset-4"
        >
          Đăng nhập
        </Link>{" "}
        để để lại đánh giá cho sản phẩm này.
      </p>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    let result;
    try {
      result = await submitReviewAction({
        productId,
        rating,
        comment: String(formData.get("comment") ?? ""),
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
    setDone(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <span className="tracked-label text-[10px] text-fg-muted">
          Đánh giá của bạn
        </span>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`${star} sao`}
              className={`text-xl leading-none ${
                star <= rating ? "text-fg" : "text-border-strong"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <Textarea
        label="Nhận xét"
        name="comment"
        required
        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
      />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {done ? (
        <p className="text-xs text-fg-muted">Cảm ơn bạn đã đánh giá!</p>
      ) : null}
      <Button
        type="submit"
        variant="outline"
        disabled={submitting}
        className="w-fit"
      >
        {submitting ? "Đang gửi..." : "Gửi đánh giá"}
      </Button>
    </form>
  );
}
