"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { topUpAction } from "@/lib/actions/wallet";

export default function TopUpForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    let result;
    try {
      result = await topUpAction({
        amount: Number(formData.get("amount")),
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
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <Field
          label="Số tiền nạp (VNĐ)"
          type="number"
          name="amount"
          min={10000}
          step={10000}
          required
          placeholder="500000"
          wrapperClassName="flex-1"
        />
        <Button
          type="submit"
          variant="solid"
          disabled={submitting}
          className="shrink-0"
        >
          {submitting ? "Đang xử lý..." : "Nạp tiền"}
        </Button>
      </form>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
