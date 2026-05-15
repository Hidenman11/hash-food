import { cn } from "@/lib/cn";

type StatCardProps = {
  title: string;
  value: string;
  hint?: string;
  delta: string;
  trend: "up" | "down" | "neutral";
};

export function StatCard({ title, value, hint, delta, trend }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#111] to-[#0c0c0c] p-5 shadow-xl shadow-black/40 ring-1 ring-white/[0.02]">
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-zinc-600">{hint}</p> : null}
      <div className="mt-4 flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
            trend === "up" && "bg-emerald-500/15 text-emerald-400",
            trend === "down" && "bg-red-500/15 text-red-400",
            trend === "neutral" && "bg-zinc-500/15 text-zinc-400",
          )}
        >
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"} {delta}
        </span>
        <span className="text-xs text-zinc-600">vs last week</span>
      </div>
    </div>
  );
}
