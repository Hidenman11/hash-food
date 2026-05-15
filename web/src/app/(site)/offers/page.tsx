import type { Metadata } from "next";
import { OffersPage } from "@/components/customer/OffersPage";

export const metadata: Metadata = {
  title: "Offers",
  description: "View promo codes and food delivery offers on HASH FOOD.",
};

export default function Page() {
  return <OffersPage />;
}
