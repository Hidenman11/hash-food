import type { Metadata } from "next";
import { CartPage } from "@/components/customer/CartPage";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your HASH FOOD cart and checkout.",
};

export default function Page() {
  return <CartPage />;
}
