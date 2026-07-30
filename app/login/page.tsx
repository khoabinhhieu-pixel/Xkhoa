import Link from "next/link";
import Placeholder from "@/components/ui/Placeholder";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="grid flex-1 md:grid-cols-2">
      <div className="relative hidden md:block">
        <Placeholder tone={4} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-x-10 bottom-10">
          <SectionLabel text="Fashion Shop" />
          <p className="mt-3 max-w-sm text-2xl font-medium leading-snug tracking-tight">
            Đăng nhập để tiếp tục hành trình thời trang bền vững của bạn.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-16 md:px-12">
        <Reveal className="w-full max-w-sm">
          <h1 className="text-3xl font-medium tracking-tight">Đăng nhập</h1>
          <p className="mt-2 text-sm text-fg-muted">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-fg underline underline-offset-4"
            >
              Đăng ký ngay
            </Link>
          </p>
          <LoginForm callbackUrl={callbackUrl || "/"} />
        </Reveal>
      </div>
    </div>
  );
}
