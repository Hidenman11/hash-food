import Link from "next/link";
import { cn } from "@/lib/cn";

function ScooterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 16.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm12.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M6.5 16.5h5l1.2-4H19l1-3H9.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.5V7a1 1 0 0 1 1-1h3v3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  iconClassName?: string;
};

export function Logo({ className, iconClassName }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("group flex shrink-0 items-center gap-2.5", className)}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 ring-1 ring-white/10">
        <ScooterIcon className={cn("h-5 w-5 text-white", iconClassName)} />
      </span>
      <span className="text-lg font-bold tracking-tight sm:text-xl">
        <span className="text-white">HASH </span>
        <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
          FOOD
        </span>
      </span>
    </Link>
  );
}
