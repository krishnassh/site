import type { Metadata, Viewport } from "next";
import { Inter, Silkscreen } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { profile } from "@/data/profile";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// only used by the canvas name card
const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: profile.name,
  description: profile.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* dark by default, only a saved "light" choice turns it off */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="light"){document.documentElement.classList.remove("dark");document.querySelector('meta[name="theme-color"]').setAttribute("content","#fafafa")}}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`min-h-screen bg-neutral-50 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100 ${inter.className} ${silkscreen.variable}`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
