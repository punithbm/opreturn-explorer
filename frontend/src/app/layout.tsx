import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OP_RETURN Explorer",
  description: "Bitcoin OP_RETURN Transaction Explorer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-mono antialiased">{children}</body>
    </html>
  );
}
