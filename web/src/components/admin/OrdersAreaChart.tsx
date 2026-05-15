"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Mon", orders: 420 },
  { day: "Tue", orders: 510 },
  { day: "Wed", orders: 480 },
  { day: "Thu", orders: 620 },
  { day: "Fri", orders: 780 },
  { day: "Sat", orders: 910 },
  { day: "Sun", orders: 860 },
];

export function OrdersAreaChart() {
  return (
    <div className="h-[300px] w-full min-w-0 min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "#fafafa",
            }}
            labelStyle={{ color: "#a1a1aa" }}
            formatter={(value) => [`${value ?? 0} orders`, "Volume"]}
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#fb923c"
            strokeWidth={2}
            fill="url(#ordersFill)"
            dot={false}
            activeDot={{ r: 4, fill: "#fb923c", stroke: "#0a0a0a", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
