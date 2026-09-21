import { Metadata } from "next";
import AboutClient from "./AboutClient";
import { PAGE_DEFAULTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: PAGE_DEFAULTS.about.title,
  description: PAGE_DEFAULTS.about.description,
  keywords: PAGE_DEFAULTS.about.keywords.split(", "),
  alternates: {
    canonical: "https://tribaldiscoverytour.com/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
