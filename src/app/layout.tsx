import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { getSiteSettings } from "@/lib/settings";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.fullName}`,
    },
    description: settings.metaDescription,
    keywords: settings.keywords.split(",").map((k) => k.trim()),
    authors: [{ name: settings.fullName }],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: settings.fullName,
      title: settings.siteTitle,
      description: settings.metaDescription,
      images: settings.ogImage ? [{ url: settings.ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle,
      description: settings.metaDescription,
      images: settings.ogImage ? [settings.ogImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
