import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 font-semibold shadow-lg shadow-orange-500/25 hover:from-orange-400 hover:to-amber-400 focus-visible:ring-orange-400/80",
  secondary:
    "border border-white/15 bg-white/5 text-zinc-100 hover:bg-white/10 focus-visible:ring-white/30",
  ghost:
    "text-zinc-300 hover:bg-white/5 hover:text-white focus-visible:ring-white/20",
};

type ButtonProps =
  | ({
      href: string;
      children: ReactNode;
      className?: string;
      variant?: Variant;
    } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">)
  | ({
      href?: undefined;
      children: ReactNode;
      className?: string;
      variant?: Variant;
    } & ComponentProps<"button">);

export function Button(props: ButtonProps) {
  const { className, variant = "primary" } = props;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:px-5 sm:text-[0.9375rem]",
    variants[variant],
    className,
  );

  if ("href" in props && props.href) {
    const { href, children: c, className: _cn, variant: _v, ...linkRest } = props;
    void _cn;
    void _v;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {c}
      </Link>
    );
  }

  const {
    children: c,
    className: _cn,
    variant: _v,
    ...buttonRest
  } = props as Extract<ButtonProps, { href?: undefined }>;
  void _cn;
  void _v;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {c}
    </button>
  );
}
