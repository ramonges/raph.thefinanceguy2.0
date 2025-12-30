import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raph The Finance Guy | Trading Interview Prep",
  description: "Master Trading Interviews with Confidence. Practice mental math, probability puzzles, trading intuition, Greeks, behavioral questions, and ML concepts.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: "Raph The Finance Guy | Trading Interview Prep",
    description: "Master Trading Interviews with Confidence. Practice mental math, probability puzzles, trading intuition, Greeks, behavioral questions, and ML concepts.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Raph The Finance Guy | Trading Interview Prep",
    description: "Master Trading Interviews with Confidence. Practice mental math, probability puzzles, trading intuition, Greeks, behavioral questions, and ML concepts.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://raphthefinanceguy.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
