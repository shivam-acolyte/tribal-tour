import { Metadata } from "next";
import PackagesClient from "./PackagesClient";
import { BRAND } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Tribal Tour Packages | 3-15 Day Authentic Itineraries | ${BRAND.name}`,
  description: "Choose from hand-crafted tribal tour packages (3-15 days) across Northeast India, Rajasthan, Gujarat, Odisha, and Central India. All-inclusive guided cultural journeys.",
  keywords: ["tribal tour packages", "India travel packages", "tribal itineraries", "northeast tour packages", "cultural tour packages", "custom tours India"],
  alternates: { canonical: `${BRAND.url}/packages` },
  openGraph: {
    title: `Tribal Tour Packages | ${BRAND.name}`,
    description: "Explore all-inclusive tribal tour packages with verified guides, homestays, and cultural immersion.",
    url: `${BRAND.url}/packages`,
  },
};

export default function PackagesPage() {
  return <PackagesClient />;
}
