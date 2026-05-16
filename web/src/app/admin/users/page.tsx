"use client";

import { useEffect, useState } from "react";
import { getAdminUsers, type AdminUser } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminUsers({ limit: 100 })
      .then((result) => setUsers(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load users"));
  }, []);

  if (error) return <p className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-red-100">{error}</p>;

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-semibold text-white">Users</h2>
      <div className="grid gap-3">
        {users.map((user) => (
          <article key={user.id} className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{user.fullName || user.email}</p>
                <p className="text-sm text-zinc-500">{user.email} · {user.phone || "No phone"}</p>
              </div>
              <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-orange-300">
                {user.role.replace(/_/g, " ")}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
