import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Games Tracker",
  description: "Track free game giveaways from Epic, Steam, PlayStation, GG.deals, and IsThereAnyDeal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
