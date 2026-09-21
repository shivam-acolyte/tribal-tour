import { Metadata } from "next";
import { Suspense } from "react";
import ToursClient from "./ToursClient";
import { PAGE_DEFAULTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: PAGE_DEFAULTS.tours.title,
  description: PAGE_DEFAULTS.tours.description,
  keywords: PAGE_DEFAULTS.tours.keywords.split(", "),
  alternates: { canonical: "https://tribaldiscoverytour.com/tours" },
};

export default function ToursPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>}>
      <ToursClient />
    </Suspense>
  );
}
