import type { Metadata } from "next";
import { RestaurantsPage } from "@/components/customer/RestaurantsPage";

export const metadata: Metadata = {
  title: "Restaurants",
  description: "Browse restaurants near you on HASH FOOD.",
};

type PageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <RestaurantsPage initialQuery={params.q ?? ""} initialCategory={params.category} />
  );
}
