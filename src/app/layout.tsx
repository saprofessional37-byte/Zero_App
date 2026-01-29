import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZERO - The Anti-Advice App",
  description:
    "Forced Scarcity. One idea. No escape. Execute or kill it. No alternatives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-mono antialiased">{children}</body>
    </html>
  );
}
