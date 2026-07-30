import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import Placeholder from "@/components/ui/Placeholder";
import { getTestimonials } from "@/lib/queries/testimonials";

export default async function TestimonialsSection() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-(--container-page)">
        <Reveal>
          <SectionLabel text="Khách hàng nói gì" align="center" />
          <h2 className="mx-auto mt-4 max-w-xl text-center text-3xl font-medium tracking-tight md:text-4xl">
            Được tin dùng bởi những người yêu sự tối giản
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <Reveal key={testimonial.id} delay={Math.min(i * 0.06, 0.3)}>
              <div className="flex h-full flex-col gap-4 border border-border p-6">
                <div className="flex items-center gap-3">
                  <Placeholder
                    tone={testimonial.avatarTone}
                    className="h-10 w-10 shrink-0 rounded-full"
                  />
                  <div>
                    <p className="text-sm text-fg">{testimonial.authorName}</p>
                    {testimonial.authorRole ? (
                      <p className="text-xs text-fg-muted">
                        {testimonial.authorRole}
                      </p>
                    ) : null}
                  </div>
                </div>
                {testimonial.rating ? (
                  <div
                    className="text-xs text-fg"
                    aria-label={`${testimonial.rating} trên 5 sao`}
                  >
                    {"★".repeat(testimonial.rating)}
                    <span className="text-border-strong">
                      {"★".repeat(5 - testimonial.rating)}
                    </span>
                  </div>
                ) : null}
                <p className="text-sm leading-relaxed text-fg-muted">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
