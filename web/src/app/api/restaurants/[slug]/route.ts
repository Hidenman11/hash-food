import { NextResponse, type NextRequest } from "next/server";
import { getSampleRestaurant } from "@/lib/sample-restaurants";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const restaurant = getSampleRestaurant(slug);

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  return NextResponse.json({ data: restaurant });
}
