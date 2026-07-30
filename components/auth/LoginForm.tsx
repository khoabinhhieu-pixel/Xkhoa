"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Field from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { loginAction } from "@/lib/actions/auth";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
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
      result = await loginAction({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
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
        autoComplete="current-password"
        required
        minLength={6}
        placeholder="••••••••"
      />
      <div className="flex items-center justify-between text-xs text-fg-muted">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-3.5 w-3.5 accent-fg" />
          Ghi nhớ đăng nhập
        </label>
        <Link href="#" className="hover:text-fg">
          Quên mật khẩu?
        </Link>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <Button
        type="submit"
        variant="solid"
        disabled={submitting}
        className="w-full"
      >
        {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
}
