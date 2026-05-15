"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { t: "00:00", onTime: 88, late: 12 },
  { t: "04:00", onTime: 72, late: 28 },
  { t: "08:00", onTime: 65, late: 35 },
  { t: "12:00", onTime: 58, late: 42 },
  { t: "16:00", onTime: 70, late: 30 },
  { t: "20:00", onTime: 82, late: 18 },
];

export function DeliveryLineChart() {
  return (
    <div className="h-[280px] w-full min-w-0 min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="t"
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
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "#fafafa",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#71717a" }} />
          <Line
            type="monotone"
            dataKey="onTime"
            name="On-time"
            stroke="#34d399"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="late"
            name="Late / issues"
            stroke="#f87171"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
