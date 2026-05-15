import type { Metadata } from "next";
import { CustomerDashboard } from "@/components/customer/CustomerDashboard";

export const metadata: Metadata = {
  title: "Customer Dashboard",
  description: "Search restaurants, place orders, pay, and track delivery with HASH FOOD.",
};

export default function CustomerPage() {
  return <CustomerDashboard />;
}
