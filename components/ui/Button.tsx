"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import Link, { type LinkProps } from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type Variant = "solid" | "outline" | "text";

const VARIANT_CLASS: Record<Variant, string> = {
  solid:
    "tracked-label inline-flex items-center justify-center gap-2 bg-fg px-6 py-3 text-[11px] text-bg",
  outline:
    "tracked-label inline-flex items-center justify-center gap-2 border border-fg px-6 py-3 text-[11px] text-fg transition-colors hover:bg-fg hover:text-bg",
  text: "tracked-label inline-flex w-fit items-center gap-2 border-b border-fg pb-1 text-[11px] text-fg",
};

const TAP_TRANSITION = { type: "spring" as const, stiffness: 500, damping: 30 };

type ButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: Variant;
};

export function Button({
  children,
  variant = "solid",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: variant === "text" ? 1 : 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={TAP_TRANSITION}
      className={`${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

const MotionLink = motion.create(Link);

type ButtonLinkProps = LinkProps & {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
};

export function ButtonLink({
  children,
  variant = "solid",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <MotionLink
      whileHover={{ scale: variant === "text" ? 1 : 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={TAP_TRANSITION}
      className={`${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    >
      {children}
    </MotionLink>
  );
}

export function IconButton({
  children,
  className = "",
  ...props
}: HTMLMotionProps<"button">) {
  return (
    <motion.button
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.88 }}
      transition={TAP_TRANSITION}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

type IconLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
};

export function IconLink({ children, className = "", ...props }: IconLinkProps) {
  return (
    <MotionLink
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.88 }}
      transition={TAP_TRANSITION}
      className={className}
      {...props}
    >
      {children}
    </MotionLink>
  );
}
