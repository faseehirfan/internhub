import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InternHub",
  description:
    "Not another group chat. Just one place to see what's happening.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
