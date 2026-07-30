import "server-only";
import { prisma } from "@/lib/prisma";

export function getTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { displayOrder: "asc" } });
}
