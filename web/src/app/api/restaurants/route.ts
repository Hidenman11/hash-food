import { NextResponse, type NextRequest } from "next/server";
import { sampleRestaurants } from "@/lib/sample-restaurants";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const city = searchParams.get("city")?.trim().toLowerCase() ?? "";
  const category = searchParams.get("category")?.trim().toLowerCase() ?? "";

  const data = sampleRestaurants.filter((restaurant) => {
    const matchesQuery = query
      ? [
          restaurant.name,
          restaurant.description,
          restaurant.city,
          restaurant.location,
          restaurant.address,
          ...restaurant.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true;

    const matchesCity = city ? restaurant.city.toLowerCase() === city : true;
    const matchesCategory = category
      ? restaurant.tags.some((tag) => tag.toLowerCase() === category)
      : true;

    return restaurant.isActive && matchesQuery && matchesCity && matchesCategory;
  });

  return NextResponse.json(
    {
      data,
      count: data.length,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    },
  );
}
