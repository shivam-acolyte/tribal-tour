import { Metadata } from "next";
import ActivitiesClient from "./ActivitiesClient";
import { BRAND } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Tribal Activities & Experiences | Cultural Immersion | ${BRAND.name}`,
  description: "Engage in authentic tribal activities: village walks, tribal art workshops, traditional culinary experiences, cultural performances, forest treks, and living heritage homestays.",
  keywords: ["tribal activities", "tribal experiences", "cultural immersion", "village tours", "traditional workshops", "tribal activities India", "forest treks", "tribal craft workshops"],
  alternates: { canonical: `${BRAND.url}/activities` },
  openGraph: {
    title: `Tribal Activities & Experiences | ${BRAND.name}`,
    description: "Discover hands-on tribal activities, village trails, cultural festivals, and wildlife safaris across India.",
    url: `${BRAND.url}/activities`,
  },
};

export default function ActivitiesPage() {
  return <ActivitiesClient />;
}
