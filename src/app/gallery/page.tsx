import { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Photo Gallery | Tribal Discovery Tour",
  description: "Explore stunning photos from our tribal tours across North East India — Arunachal Pradesh, Meghalaya, Assam, Nagaland, and more.",
  keywords: ["tribal tour gallery", "north east india photos", "travel photography", "tribal discovery"],
  alternates: { canonical: "https://tribaldiscoverytour.com/gallery" },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
