import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Silkscreen } from "next/font/google";
import { profile } from "@/data/profile";
import { links } from "@/data/links";
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
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} | ${profile.jobTitle}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  keywords: [
    profile.name,
    profile.github,
    "kwynx",
    "portfolio",
    "systems programming",
    "DevOps",
    "open source",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title: `${profile.name} | ${profile.jobTitle}`,
    description: profile.description,
    locale: "en_US",
    images: [{ url: profile.avatar, alt: profile.name }],
  },
  twitter: {
    card: "summary",
    title: `${profile.name} | ${profile.jobTitle}`,
    description: profile.description,
    images: [profile.avatar],
  },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: ["kwynx", profile.github],
  url: profile.siteUrl,
  image: profile.avatar,
  description: profile.description,
  jobTitle: profile.jobTitle,
  sameAs: links
    .map((l) => l.href)
    .filter((h) => h.startsWith("http") && !h.startsWith(profile.siteUrl)),
};

const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "G-C0NYXNG25B";
const gtmId = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-TVZV9HCB";

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${gaId}");`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
