import type { Metadata } from "next";
import { PartnerDashboard } from "@/components/partner/PartnerDashboard";

export const metadata: Metadata = {
  title: "Rider Partner Dashboard",
  description: "Manage rider delivery assignments and partner details.",
};

export default function Page() {
  return <PartnerDashboard role="RIDER" />;
}
