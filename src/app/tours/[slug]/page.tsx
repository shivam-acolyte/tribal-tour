import { Metadata } from "next";
import TourDetailClient from "./TourDetailClient";
import { tours } from "@/lib/data/tours";
import { BRAND } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) {
    return {
      title: `Tour Not Found | ${BRAND.name}`,
      description: "The requested tour package could not be found.",
    };
  }
  return {
    title: tour.seoTitle || `${tour.name} | ${BRAND.name}`,
    description: tour.seoDescription || tour.description?.substring(0, 160),
    keywords: tour.seoKeywords?.split(", "),
    alternates: { canonical: `${BRAND.url}/tours/${tour.slug}` },
    openGraph: {
      title: tour.name,
      description: tour.description?.substring(0, 160),
      images: tour.images?.[0] ? [{ url: tour.images[0], alt: tour.name }] : [],
      type: "website",
    },
  };
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  return <TourDetailClient slug={slug} />;
}
