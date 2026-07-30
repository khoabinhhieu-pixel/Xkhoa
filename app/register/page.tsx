import Link from "next/link";
import Placeholder from "@/components/ui/Placeholder";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import RegisterForm from "@/components/auth/RegisterForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="grid flex-1 md:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-16 md:order-1 md:px-12">
        <Reveal className="w-full max-w-sm">
          <h1 className="text-3xl font-medium tracking-tight">Đăng ký</h1>
          <p className="mt-2 text-sm text-fg-muted">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-fg underline underline-offset-4"
            >
              Đăng nhập
            </Link>
          </p>
          <RegisterForm callbackUrl={callbackUrl || "/"} />
        </Reveal>
      </div>

      <div className="relative hidden md:order-2 md:block">
        <Placeholder tone={2} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-x-10 bottom-10">
          <SectionLabel text="Fashion Shop" />
          <p className="mt-3 max-w-sm text-2xl font-medium leading-snug tracking-tight">
            Tham gia cộng đồng yêu thời trang tối giản, bền vững.
          </p>
        </div>
      </div>
    </div>
  );
}
