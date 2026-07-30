import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getProductById } from "@/lib/queries/products";
import { getReviewsForProduct, getProductRatingSummary } from "@/lib/queries/reviews";
import { formatVND } from "@/lib/format";
import Reveal from "@/components/ui/Reveal";
import ProductImage from "@/components/ui/ProductImage";
import SectionLabel from "@/components/ui/SectionLabel";
import AddToCartButton from "@/components/product/AddToCartButton";
import ReviewList from "@/components/product/ReviewList";
import ReviewForm from "@/components/product/ReviewForm";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const [session, reviews, ratingSummary] = await Promise.all([
    auth(),
    getReviewsForProduct(id),
    getProductRatingSummary(id),
  ]);

  return (
    <div className="mx-auto w-full max-w-(--container-page) px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative col-span-2 aspect-4/5 overflow-hidden">
              <ProductImage
                src={product.images[0]}
                tone={product.tone}
                alt={product.name}
                className="absolute inset-0"
              />
            </div>
            <div className="relative aspect-square overflow-hidden">
              <ProductImage
                src={product.images[1]}
                tone={(product.tone + 1) % 6}
                alt={product.name}
                className="absolute inset-0"
              />
            </div>
            <div className="relative aspect-square overflow-hidden">
              <ProductImage
                src={product.images[2]}
                tone={(product.tone + 2) % 6}
                alt={product.name}
                className="absolute inset-0"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <span className="tracked-label text-[11px] text-fg-muted">
            {product.category}
          </span>
          <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <p className="text-lg text-fg">{formatVND(product.price)}</p>
            {ratingSummary.count > 0 ? (
              <span className="text-xs text-fg-muted">
                {"★".repeat(Math.round(ratingSummary.average))}
                <span className="text-border-strong">
                  {"★".repeat(5 - Math.round(ratingSummary.average))}
                </span>{" "}
                ({ratingSummary.count} đánh giá)
              </span>
            ) : null}
          </div>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-fg-muted">
            {product.description}
          </p>

          <div className="mt-6 flex gap-2">
            {product.colors.map((color) => (
              <span
                key={color}
                className="h-6 w-6 rounded-full border border-border-strong"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <AddToCartButton product={product} className="mt-8 w-full sm:w-auto" />
        </Reveal>
      </div>

      <Reveal className="mt-20 max-w-2xl md:mt-32" as="section">
        <SectionLabel text="Đánh giá từ khách hàng" />
        <div className="mt-8">
          <ReviewList reviews={reviews} />
        </div>
        <div className="mt-10 border-t border-border pt-8">
          <h2 className="text-sm text-fg">Viết đánh giá của bạn</h2>
          <div className="mt-4">
            <ReviewForm productId={product.id} isLoggedIn={!!session?.user} />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
