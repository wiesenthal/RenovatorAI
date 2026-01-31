import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RenovatorAI - AI House Renovation",
  description: "Transform your space with AI-powered renovation visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
