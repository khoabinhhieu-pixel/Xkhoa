import { notFound } from "next/navigation";
import { getProductById } from "@/lib/queries/products";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <SectionLabel text="Chỉnh sửa sản phẩm" />
        <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
          {product.name}
        </h1>
      </Reveal>
      <Reveal delay={0.05} className="mt-10">
        <ProductForm product={product} />
      </Reveal>
    </div>
  );
}
