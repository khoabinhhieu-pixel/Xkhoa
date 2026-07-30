import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchOverlay from "@/components/search/SearchOverlay";
import { auth } from "@/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fashion Shop — Modern Essentials",
  description:
    "Fashion Shop — quần áo tối giản, hiện đại. Thiết kế bền, chất liệu tốt, dành cho mọi hoàn cảnh.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <Header session={session} />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <CartDrawer />
        <SearchOverlay />
      </body>
    </html>
  );
}
