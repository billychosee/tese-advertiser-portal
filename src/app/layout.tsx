import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: "TESE Advertising Portal",
  description: "Advertiser portal for TESE - Run ads on TESE videos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
