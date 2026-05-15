export function AdminModulePlaceholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-10 text-center shadow-xl shadow-black/30">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
        {description ??
          "This module is ready to wire to your API. Use the dashboard overview for live analytics."}
      </p>
    </div>
  );
}
