import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-16 md:px-10 md:py-24">
      <Reveal>
        <SectionLabel text="Sản phẩm mới" />
        <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
          Thêm sản phẩm
        </h1>
      </Reveal>
      <Reveal delay={0.05} className="mt-10">
        <ProductForm />
      </Reveal>
    </div>
  );
}
