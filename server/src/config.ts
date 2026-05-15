import "dotenv/config";

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/hashfood"),
  jwtSecret: required("JWT_SECRET", "dev-only-change-me-in-production"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  corsOrigin: process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? [
    "http://localhost:3000",
  ],
  googleMapsBrowserKey: process.env.GOOGLE_MAPS_BROWSER_KEY ?? "",
  googleMapsServerKey: process.env.GOOGLE_MAPS_SERVER_KEY ?? "",
  mobileMoney: {
    provider: (process.env.MOBILE_MONEY_PROVIDER ?? "mock") as "mock" | "flutterwave" | "http",
    flutterwaveSecret: process.env.FLUTTERWAVE_SECRET_KEY ?? "",
    flutterwavePublic: process.env.FLUTTERWAVE_PUBLIC_KEY ?? "",
    webhookSecret: process.env.MOBILE_MONEY_WEBHOOK_SECRET ?? "",
    httpInitUrl: process.env.MOBILE_MONEY_HTTP_INIT_URL ?? "",
  },
};
