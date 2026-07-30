import Reveal from "@/components/ui/Reveal";
import Placeholder from "@/components/ui/Placeholder";
import SectionLabel from "@/components/ui/SectionLabel";
import ProductCard from "@/components/product/ProductCard";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { ButtonLink, Button } from "@/components/ui/Button";
import { getNewArrivals } from "@/lib/queries/products";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const SWATCH_STRIP = [0, 1, 2, 3, 4];

const LOOKBOOK_GRID = [
  { tone: 0, label: "Look 01" },
  { tone: 2, label: "Look 02" },
  { tone: 4, label: "Look 03" },
  { tone: 5, label: "Look 04" },
];

export default async function Home() {
  const NEW_ARRIVALS = await getNewArrivals(4);

  return (
    <>
      <section className="mx-auto max-w-(--container-page) px-5 pb-10 pt-10 md:px-10 md:pb-16 md:pt-14">
        <Reveal>
          <span className="tracked-label text-[11px] text-fg-muted">
            BST Xuân Hè &apos;26
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-6 max-w-4xl text-[13vw] font-medium leading-[0.94] tracking-tight text-fg sm:text-6xl md:text-7xl lg:text-[6.5rem]">
            Một tủ đồ cho
            <br />
            mọi mùa phía trước
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-sm leading-relaxed text-fg-muted">
              Thiết kế tối giản, chất liệu bền vững. Từng đường may hướng
              đến sự thoải mái lâu dài, không chạy theo xu hướng ngắn hạn.
            </p>
            <ButtonLink href="#new-arrivals" variant="text">
              Khám phá bộ sưu tập
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      <Reveal as="section" className="px-5 md:px-10">
        <div className="mx-auto grid max-w-(--container-page) grid-cols-5 gap-1.5 md:gap-2">
          {SWATCH_STRIP.map((tone) => (
            <Placeholder key={tone} tone={tone} className="aspect-square" />
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel text="Triết lý của Fashion Shop" align="center" />
          <p className="mt-6 text-2xl font-medium leading-snug tracking-tight md:text-4xl">
            Thiết kế bền vững. Chất lượng lâu dài. Thời trang như một lựa
            chọn có trách nhiệm.
          </p>
        </div>
      </Reveal>

      <Reveal as="section" className="px-5 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto grid max-w-(--container-page) grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-2">
          {LOOKBOOK_GRID.map((item) => (
            <Placeholder
              key={item.label}
              tone={item.tone}
              label={item.label}
              className="aspect-square"
            />
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="relative">
        <div className="relative h-[70vh] min-h-[420px] w-full md:h-[85vh]">
          <Placeholder tone={1} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-linear-to-t from-bg/80 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-8 md:inset-x-10 md:bottom-14">
            <span className="tracked-label text-[11px] text-fg-muted">
              Nhật ký
            </span>
            <h2 className="mt-3 max-w-xl text-4xl font-medium leading-[0.98] tracking-tight md:text-6xl">
              Mặc đẹp, ở bất cứ đâu
            </h2>
          </div>
        </div>
      </Reveal>

      <section className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-(--container-page) gap-8 md:grid-cols-2 md:gap-12">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Placeholder tone={2} className="absolute inset-0" />
              <span className="tracked-label absolute left-4 top-4 text-[10px] text-fg-muted">
                Sản phẩm chủ đạo
              </span>
            </div>
          </Reveal>

          <div className="flex flex-col justify-center">
            <Reveal delay={0.05}>
              <SectionLabel text="The Overcoat" />
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="mt-4 max-w-md text-3xl font-medium leading-tight tracking-tight md:text-4xl">
                Được may đo cho thời tiết giao mùa
              </h3>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-fg-muted">
                Vải len pha cao cấp, form dáng tối giản, đủ ấm cho những
                ngày chuyển mùa mà vẫn giữ được sự thanh lịch. Thiết kế một
                lần, mặc được nhiều mùa.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <ButtonLink href="/products?gender=nam" variant="text" className="mt-8">
                Xem chi tiết
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="new-arrivals" className="px-5 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-(--container-page)">
          <Reveal>
            <div className="flex items-end justify-between">
              <div>
                <SectionLabel text="Mới về" />
                <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                  Bộ sưu tập mới nhất
                </h2>
              </div>
              <ButtonLink
                href="/products"
                variant="text"
                className="hidden md:flex"
              >
                Xem tất cả
                <ArrowRightIcon />
              </ButtonLink>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {NEW_ARRIVALS.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.06}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex justify-center md:hidden">
            <ButtonLink href="/products" variant="outline">
              Xem tất cả sản phẩm
              <ArrowRightIcon />
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <section id="story" className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-(--container-page) items-center gap-8 md:grid-cols-2 md:gap-16">
          <Reveal>
            <SectionLabel text="Cam kết bền vững" />
            <h2 className="mt-4 max-w-md text-3xl font-medium leading-tight tracking-tight md:text-4xl">
              Giảm dấu chân khí hậu, giữ vững chất lượng
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-fg-muted">
              Chúng tôi chọn nhà máy đạt chuẩn lao động công bằng, ưu tiên
              chất liệu tái chế và sản xuất theo đơn đặt trước để hạn chế
              tồn kho dư thừa.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-3">
              {[
                ["68%", "vải tái chế"],
                ["100%", "nhà máy đạt chuẩn"],
                ["-40%", "phát thải sản xuất"],
              ].map(([stat, desc]) => (
                <div key={desc}>
                  <p className="text-2xl font-medium tracking-tight">
                    {stat}
                  </p>
                  <p className="mt-1 text-xs text-fg-muted">{desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-4/5 overflow-hidden md:aspect-3/4">
              <Placeholder tone={5} className="absolute inset-0" />
            </div>
          </Reveal>
        </div>
      </section>

      <TestimonialsSection />

      <Reveal as="section" className="px-5 pb-24 md:px-10">
        <div className="relative mx-auto max-w-(--container-page) overflow-hidden">
          <Placeholder tone={3} className="absolute inset-0" />
          <div className="absolute inset-0 bg-bg/55" />
          <div className="relative flex flex-col items-center gap-6 px-6 py-20 text-center md:py-28">
            <SectionLabel text="Đăng ký nhận tin" align="center" />
            <h2 className="max-w-xl text-3xl font-medium leading-tight tracking-tight md:text-5xl">
              Là người đầu tiên biết về bộ sưu tập mới
            </h2>
            <form className="mt-4 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder="Email của bạn"
                className="w-full border-b border-border-strong bg-transparent px-1 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-fg focus:outline-none"
              />
              <Button type="submit" variant="outline" className="shrink-0">
                Gửi
              </Button>
            </form>
          </div>
        </div>
      </Reveal>
    </>
  );
}
