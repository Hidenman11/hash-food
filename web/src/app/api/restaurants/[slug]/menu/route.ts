import { NextResponse, type NextRequest } from "next/server";
import { getSampleMenu, getSampleRestaurant } from "@/lib/sample-restaurants";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  if (!getSampleRestaurant(slug)) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  return NextResponse.json({ data: getSampleMenu(slug) });
}
