import type { Metadata } from "next";
import { RestaurantsPage } from "@/components/customer/RestaurantsPage";

export const metadata: Metadata = {
  title: "Restaurants",
  description: "Browse restaurants near you on HASH FOOD.",
};

export default function Page() {
  return <RestaurantsPage />;
}
