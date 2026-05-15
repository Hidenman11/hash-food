import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your HASH FOOD account.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
