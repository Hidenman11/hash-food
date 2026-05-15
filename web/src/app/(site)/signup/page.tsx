import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a HASH FOOD account.",
};

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
  const initialRole =
    params.role === "rider"
      ? "RIDER"
      : params.role === "restaurant"
        ? "RESTAURANT_ADMIN"
        : "CUSTOMER";

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
