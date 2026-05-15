export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

export type AuthUser = {
  id: string;
  email: string;
  phone: string | null;
  fullName: string | null;
  role: "CUSTOMER" | "RESTAURANT_ADMIN" | "RIDER" | "ADMIN";
  createdAt: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};
