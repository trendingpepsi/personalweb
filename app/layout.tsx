import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yusen Zhai — Personal Website",
  description: "AI4Counseling — research, publications, and contact links.",
  metadataBase: new URL("https://example.com"), // update after deploy
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
