import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "TravelAI - AI-Powered Indian Travel Planner",
  description: "Plan your perfect Indian family trip with AI-powered itinerary generation. Explore religious sites, historical monuments, beaches, mountains, and cities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
