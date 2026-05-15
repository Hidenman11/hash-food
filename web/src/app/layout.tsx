import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HASH FOOD — Favorite food, fast delivery",
    template: "%s · HASH FOOD",
  },
  description:
    "Order from the best restaurants near you. Fast delivery, live tracking, and secure mobile money checkout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-screen bg-black font-sans text-zinc-50">
        {children}
      </body>
    </html>
  );
}
