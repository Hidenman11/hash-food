"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { label: "M-Pesa", amount: 42 },
  { label: "Airtel", amount: 18 },
  { label: "Tigo", amount: 12 },
  { label: "Cards", amount: 22 },
  { label: "Cash", amount: 6 },
];

export function RevenueBarChart() {
  return (
    <div className="h-[300px] w-full min-w-0 min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fdba74" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={36}
            tickFormatter={(v) => `${v}M`}
          />
          <Tooltip
            cursor={{ fill: "rgba(251, 146, 60, 0.08)" }}
            contentStyle={{
              backgroundColor: "#111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "#fafafa",
            }}
            formatter={(value) => [`TSh ${value ?? 0}M`, "Share"]}
          />
          <Bar
            dataKey="amount"
            fill="url(#barGrad)"
            radius={[8, 8, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
