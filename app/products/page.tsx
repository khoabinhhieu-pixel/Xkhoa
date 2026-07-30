import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";
import { getProducts } from "@/lib/queries/products";

const TABS: { key?: "nam" | "nu"; label: string }[] = [
  { key: undefined, label: "Tất cả" },
  { key: "nu", label: "Nữ" },
  { key: "nam", label: "Nam" },
];

const TITLES: Record<string, string> = {
  nam: "Thời trang Nam",
  nu: "Thời trang Nữ",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ gender?: string }>;
}) {
  const { gender } = await searchParams;
  const products = await getProducts({ gender });
  const title = (gender && TITLES[gender]) || "Tất cả sản phẩm";

  return (
    <div className="mx-auto w-full max-w-(--container-page) px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <span className="tracked-label text-[11px] text-fg-muted">
          Cửa hàng
        </span>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
            {title}
          </h1>
          <nav className="tracked-label flex gap-6 text-[11px]">
            {TABS.map((tab) => {
              const active = (tab.key ?? "") === (gender ?? "");
              const href = tab.key
                ? `/products?gender=${tab.key}`
                : "/products";
              return (
                <Link
                  key={tab.label}
                  href={href}
                  className={`border-b pb-1 transition-colors ${
                    active
                      ? "border-fg text-fg"
                      : "border-transparent text-fg-muted hover:text-fg"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <p className="mt-3 text-xs text-fg-muted">
          {products.length} sản phẩm
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={Math.min(i * 0.05, 0.3)}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
