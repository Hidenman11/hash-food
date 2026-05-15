import type { Metadata } from "next";
import { PartnerVerification } from "@/components/partner/PartnerVerification";

export const metadata: Metadata = {
  title: "Partner Verification",
  description: "Verify your HASH FOOD partner account.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  return <PartnerVerification email={params.email ?? ""} />;
}
