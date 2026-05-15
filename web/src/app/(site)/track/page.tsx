import type { Metadata } from "next";
import { TrackOrderPage } from "@/components/customer/TrackOrderPage";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your HASH FOOD order in real time.",
};

export default function Page() {
  return <TrackOrderPage />;
}
