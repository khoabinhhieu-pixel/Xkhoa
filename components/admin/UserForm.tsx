"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { updateUserAction } from "@/lib/actions/users-admin";

const ROLES = [
  { value: "CUSTOMER", label: "Khách hàng" },
  { value: "ADMIN", label: "Quản trị viên" },
];

type UserFormProps = {
  user: { id: string; fullName: string; email: string; role: string };
  isSelf: boolean;
};

export default function UserForm({ user, isSelf }: UserFormProps) {
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
      result = await updateUserAction(user.id, formData);
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
    router.push("/admin/users");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field
        label="Họ và tên"
        name="fullName"
        required
        defaultValue={user.fullName}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        required
        defaultValue={user.email}
      />
      <label className="flex flex-col gap-2">
        <span className="tracked-label text-[10px] text-fg-muted">
          Vai trò
        </span>
        <select
          name="role"
          defaultValue={user.role}
          disabled={isSelf}
          className="w-full border-b border-border-strong bg-transparent py-2 text-sm text-fg focus:border-fg focus:outline-none disabled:opacity-50"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value} className="bg-bg text-fg">
              {r.label}
            </option>
          ))}
        </select>
        {isSelf ? (
          <>
            <input type="hidden" name="role" value={user.role} />
            <p className="text-xs text-fg-muted">
              Không thể tự đổi vai trò của chính mình.
            </p>
          </>
        ) : null}
      </label>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <Button
        type="submit"
        variant="solid"
        disabled={submitting}
        className="w-fit"
      >
        {submitting ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </form>
  );
}
