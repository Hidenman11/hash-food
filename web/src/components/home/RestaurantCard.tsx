import Link from "next/link";
import { cn } from "@/lib/cn";
import { SafeImage } from "@/components/ui/SafeImage";

export type RestaurantCardProps = {
  name: string;
  cuisines: string;
  image: string;
  imageAlt: string;
  rating: string;
  deliveryMins: string;
  distance: string;
  deliveryFee: string;
  freeDelivery?: boolean;
  href?: string;
};

export function RestaurantCard({
  name,
  cuisines,
  image,
  imageAlt,
  rating,
  deliveryMins,
  distance,
  deliveryFee,
  freeDelivery,
  href = "/restaurants",
}: RestaurantCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0f0f0f] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.03] transition duration-300",
        "hover:-translate-y-1 hover:border-orange-500/25 hover:shadow-[0_28px_70px_-28px_rgba(251,146,60,0.18)]",
      )}
    >
      <div className="relative aspect-[5/3] w-full overflow-hidden">
        <SafeImage
          src={image}
          alt={imageAlt}
          fill
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-md ring-1 ring-white/10">
            <span className="text-amber-400" aria-hidden>
              ★
            </span>
            {rating}
          </span>
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-zinc-100 backdrop-blur-md ring-1 ring-white/10">
            {deliveryMins}
          </span>
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-zinc-100 backdrop-blur-md ring-1 ring-white/10">
            {distance}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 pt-4">
        <h3 className="text-lg font-semibold tracking-tight text-white">{name}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-zinc-500">{cuisines}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.05] pt-4">
          <span className="text-sm font-medium text-zinc-200">{deliveryFee}</span>
          {freeDelivery ? (
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-400 ring-1 ring-emerald-500/20">
              Free delivery
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
