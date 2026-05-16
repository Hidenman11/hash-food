import type { Metadata } from "next";
import { RestaurantDetailPage } from "@/components/customer/RestaurantDetailPage";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    title,
    description: `Browse the menu and order from ${title} on HASH FOOD.`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <RestaurantDetailPage slug={slug} />;
}
