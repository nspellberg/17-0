import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "17-0 | NFL All-Time Draft Game",
  description: "Build an all-time NFL roster and see if you can finish 17-0."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
