import { Metadata } from "next";
import DestinationsClient from "./DestinationsClient";
import { PAGE_DEFAULTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: PAGE_DEFAULTS.destinations.title,
  description: PAGE_DEFAULTS.destinations.description,
  keywords: PAGE_DEFAULTS.destinations.keywords.split(", "),
  alternates: { canonical: "https://tribaldiscoverytour.com/destinations" },
};

export default function DestinationsPage() {
  return <DestinationsClient />;
}
