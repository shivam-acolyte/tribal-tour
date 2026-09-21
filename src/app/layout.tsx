import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { BRAND } from "@/lib/seo";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-accent",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1f2937",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: "Authentic Tribal Tours in India | Tribal Discovery Tour",
    template: `%s | ${BRAND.name}`,
  },
  description:
    "Discover authentic tribal experiences in Rajasthan, Odisha, Gujarat, and Northeast India. Expert-led sustainable tours with local guides and cultural immersion.",
  keywords: [
    "tribal tours India",
    "authentic tribal experiences",
    "Rajasthan tours",
    "Odisha tours",
    "cultural tourism",
    "sustainable travel",
    "adventure tours",
    "tribal destinations",
  ],
  authors: [{ name: BRAND.name, url: BRAND.url }],
  creator: BRAND.name,
  publisher: BRAND.name,
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "google35c1a4c8212447cc",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BRAND.url,
    siteName: BRAND.name,
    title: "Authentic Tribal Tours in India | Tribal Discovery Tour",
    description:
      "Discover authentic tribal experiences in Rajasthan, Odisha, Gujarat, and Northeast India. Expert-led sustainable tours with local guides.",
    images: [
      {
        url: BRAND.image,
        width: 1200,
        height: 630,
        alt: "Tribal Discovery Tour",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TribalDiscovery",
    creator: "@TribalDiscovery",
    title: "Authentic Tribal Tours in India | Tribal Discovery Tour",
    description:
      "Discover authentic tribal experiences in Rajasthan, Odisha, Gujarat, and Northeast India.",
    images: [BRAND.image],
  },
  alternates: {
    canonical: BRAND.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const travelAgencySchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: BRAND.name,
    description: BRAND.description,
    url: BRAND.url,
    logo: `${BRAND.url}/logo.png`,
    image: BRAND.image,
    telephone: BRAND.phone,
    email: BRAND.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.address.streetAddress,
      addressLocality: BRAND.address.addressLocality,
      addressRegion: BRAND.address.addressRegion,
      postalCode: BRAND.address.postalCode,
      addressCountry: BRAND.address.addressCountry,
    },
    sameAs: [
      "https://twitter.com/TribalDiscovery",
      "https://www.instagram.com/tribal.discovery.tour",
      "https://www.facebook.com/TribalDiscoveryTour",
    ],
    priceRange: "₹₹-₹₹₹₹",
    areaServed: "IN",
    knowsAbout: [
      "Tribal Tourism",
      "Adventure Tours",
      "Cultural Tours",
      "Heritage Tourism",
    ],
  };

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${caveat.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(travelAgencySchema),
          }}
        />
      </head>
      <body className="bg-background text-foreground font-body antialiased overflow-x-hidden">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
