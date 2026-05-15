import { AboutPage } from "@/components/customer/AboutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kuhusu HASH FOOD",
  description: "Jukwaa la kisasa la food delivery nchini Tanzania.",
};

export default function Page() {
  return <AboutPage />;
}