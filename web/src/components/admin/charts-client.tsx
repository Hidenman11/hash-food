"use client";

import dynamic from "next/dynamic";

function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div
      className="w-full animate-pulse rounded-xl bg-white/[0.04] ring-1 ring-white/[0.05]"
      style={{ height }}
    />
  );
}

export const OrdersAreaChartClient = dynamic(
  () =>
    import("./OrdersAreaChart").then((m) => ({
      default: m.OrdersAreaChart,
    })),
  { ssr: false, loading: () => <ChartSkeleton height={300} /> },
);

export const RevenueBarChartClient = dynamic(
  () =>
    import("./RevenueBarChart").then((m) => ({
      default: m.RevenueBarChart,
    })),
  { ssr: false, loading: () => <ChartSkeleton height={300} /> },
);

export const DeliveryLineChartClient = dynamic(
  () =>
    import("./DeliveryLineChart").then((m) => ({
      default: m.DeliveryLineChart,
    })),
  { ssr: false, loading: () => <ChartSkeleton height={280} /> },
);
