import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stage X Garage | Service & Tuning",
  description: "Professional custom car builds, tuning and service for German and Japanese vehicles. Stage X Garage — where machines become legends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
