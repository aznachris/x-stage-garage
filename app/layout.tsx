import type { Metadata } from "next";
import "./globals.css";
import "react-day-picker/style.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Stage X Garage | Service & Tuning",
  description: "Professional custom car builds, tuning and service for German and Japanese vehicles. Stage X Garage — where machines become legends.",
  icons: {
    icon: [
      { url: "/icon", type: "image/png", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="el" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
