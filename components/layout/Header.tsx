"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "next-auth";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/ui/Icons";
import { IconButton, IconLink } from "@/components/ui/Button";
import { useUIStore } from "@/lib/stores/ui-store";
import { useCartCount } from "@/lib/stores/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";

const NAV_LINKS = [
  { label: "Mới về", href: "/#new-arrivals" },
  { label: "Nữ", href: "/products?gender=nu" },
  { label: "Nam", href: "/products?gender=nam" },
  { label: "Tất cả", href: "/products" },
  { label: "Giới thiệu", href: "/#story" },
];

export default function Header({ session }: { session: Session | null }) {
  const [open, setOpen] = useState(false);
  const accountHref = session?.user ? "/account" : "/login";
  const openSearch = useUIStore((s) => s.openSearch);
  const openCart = useUIStore((s) => s.openCart);
  const cartCount = useCartCount();
  const mounted = useMounted();

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-(--container-page) items-center justify-between px-5 py-4 md:px-10">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 md:hidden"
          aria-label="Mở menu"
        >
          <MenuIcon />
        </button>

        <Link
          href="/"
          className="tracked-label text-sm font-semibold md:text-base"
        >
          Fashion Shop
        </Link>

        <nav className="tracked-label hidden items-center gap-8 text-[11px] text-fg-muted md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <IconButton
            type="button"
            onClick={openSearch}
            aria-label="Tìm kiếm"
            className="hidden text-fg-muted transition-colors hover:text-fg md:block"
          >
            <SearchIcon />
          </IconButton>
          <IconLink
            href={accountHref}
            aria-label="Tài khoản"
            className="hidden text-fg-muted transition-colors hover:text-fg md:block"
          >
            <UserIcon />
          </IconLink>
          <IconButton
            type="button"
            onClick={openCart}
            aria-label="Giỏ hàng"
            className="relative text-fg-muted transition-colors hover:text-fg"
          >
            <BagIcon />
            {mounted && cartCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-fg text-[9px] font-medium text-bg">
                {cartCount}
              </span>
            ) : null}
          </IconButton>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-bg transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span className="tracked-label text-sm font-semibold">
            Fashion Shop
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Đóng menu"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="flex flex-col gap-6 px-6 py-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-3xl font-light tracking-tight text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="tracked-label flex gap-6 px-6 text-[11px] text-fg-muted">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openSearch();
            }}
          >
            Tìm kiếm
          </button>
          <Link href={accountHref} onClick={() => setOpen(false)}>
            Tài khoản
          </Link>
        </div>
      </div>
    </header>
  );
}
