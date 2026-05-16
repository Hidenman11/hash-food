import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

type SignupRole = "CUSTOMER" | "RESTAURANT_ADMIN" | "RIDER";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a HASH FOOD account.",
};

function parseRole(role?: string): SignupRole {
  const normalized = role?.trim().toUpperCase();
  if (normalized === "RIDER") return "RIDER";
  if (normalized === "RESTAURANT" || normalized === "RESTAURANT_ADMIN") {
    return "RESTAURANT_ADMIN";
  }
  return "CUSTOMER";
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{
    role?: string;
    email?: string;
    fullName?: string;
    phone?: string;
  }>;
}) {
  const params = await searchParams;
  const initialRole = parseRole(params.role);

  return (
    <AuthForm
      mode="signup"
      initialRole={initialRole}
      initialEmail={params.email ?? ""}
      initialFullName={params.fullName ?? ""}
      initialPhone={params.phone ?? ""}
    />
  );
}
