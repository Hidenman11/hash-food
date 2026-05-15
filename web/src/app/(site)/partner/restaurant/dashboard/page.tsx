import type { Metadata } from "next";
import { RestaurantDashboard } from "@/components/restaurant-dashboard/RestaurantDashboard";

export const metadata: Metadata = {
  title: "HASH FOOD Restaurant Dashboard",
  description: "Modern restaurant management dashboard for HASH FOOD.",
};

export default function Page() {
  return <RestaurantDashboard />;
}
