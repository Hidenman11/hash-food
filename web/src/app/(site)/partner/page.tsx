import type { Metadata } from "next";
import { PartnerPage } from "@/components/customer/PartnerPage";

export const metadata: Metadata = {
  title: "Become a Partner",
  description: "Join HASH FOOD as a restaurant or rider partner.",
};

export default function Page() {
  return <PartnerPage />;
}
