"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Field from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { registerAction } from "@/lib/actions/auth";

export default function RegisterForm({ callbackUrl }: { callbackUrl: string }) {
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
      result = await registerAction({
        fullName: String(formData.get("fullName") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        confirmPassword: String(formData.get("confirmPassword") ?? ""),
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
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
      <Field
        label="Họ và tên"
        type="text"
        name="fullName"
        autoComplete="name"
        required
        placeholder="Nguyễn Văn A"
      />
      <Field
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        required
        placeholder="ban@email.com"
      />
      <Field
        label="Mật khẩu"
        type="password"
        name="password"
        autoComplete="new-password"
        required
        minLength={6}
        placeholder="Tối thiểu 6 ký tự"
      />
      <Field
        label="Nhập lại mật khẩu"
        type="password"
        name="confirmPassword"
        autoComplete="new-password"
        required
        minLength={6}
        placeholder="••••••••"
      />
      <label className="flex items-start gap-2 text-xs text-fg-muted">
        <input
          type="checkbox"
          required
          className="mt-0.5 h-3.5 w-3.5 accent-fg"
        />
        Tôi đồng ý với{" "}
        <Link href="#" className="text-fg underline underline-offset-4">
          Điều khoản dịch vụ
        </Link>{" "}
        của Fashion Shop.
      </label>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <Button
        type="submit"
        variant="solid"
        disabled={submitting}
        className="w-full"
      >
        {submitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </Button>
    </form>
  );
}
