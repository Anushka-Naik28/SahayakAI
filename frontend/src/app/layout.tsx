import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SahayakAI - AI-Powered Citizen Welfare Copilot",
  description: "Discover, qualify for, apply, and track central and state government schemes easily with AI guidance and OCR document processing.",
  keywords: ["SahayakAI", "Digital India", "Welfare Schemes", "PM Kisan", "Ayushman Bharat", "Government Schemes", "Citizen Support"],
  authors: [{ name: "SahayakAI Team" }],
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤝</text></svg>" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
