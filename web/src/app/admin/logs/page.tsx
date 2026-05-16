"use client";

import { useEffect, useState } from "react";
import { getAdminActivity, type AdminActivity } from "@/lib/api";

function typeTone(type: AdminActivity["type"]) {
  switch (type) {
    case "order":
      return "text-sky-300 bg-sky-500/10";
    case "user":
      return "text-emerald-300 bg-emerald-500/10";
    case "rider":
      return "text-orange-300 bg-orange-500/10";
    case "restaurant":
      return "text-purple-300 bg-purple-500/10";
    case "payment":
      return "text-amber-300 bg-amber-500/10";
    default:
      return "text-zinc-300 bg-white/[0.06]";
  }
}

export default function AdminLogsPage() {
  const [activity, setActivity] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminActivity()
      .then((result) => setActivity(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load system logs"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-zinc-400">Loading system logs...</p>;
  if (error) return <p className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-red-100">{error}</p>;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">System Logs</h2>
        <p className="mt-1 text-sm text-zinc-500">Recent platform activity from users, orders, riders, restaurants, and payments.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c0c0c]">
        {activity.length ? (
          <div className="divide-y divide-white/[0.04]">
            {activity.map((item) => (
              <article key={item.id} className="grid gap-3 p-4 md:grid-cols-[9rem_1fr_auto] md:items-center">
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${typeTone(item.type)}`}>
                  {item.type}
                </span>
                <div>
                  <p className="font-semibold text-white">{item.action}</p>
                  <p className="mt-1 text-sm text-zinc-500">{item.details}</p>
                  {item.user ? <p className="mt-1 text-xs text-zinc-600">by {item.user}</p> : null}
                </div>
                <time className="text-sm text-zinc-500" dateTime={item.timestamp}>
                  {new Date(item.timestamp).toLocaleString()}
                </time>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-500">No recent logs.</div>
        )}
      </div>
    </section>
  );
}
