import { Metadata } from "next";
import ContactClient from "./ContactClient";
import { PAGE_DEFAULTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: PAGE_DEFAULTS.contact.title,
  description: PAGE_DEFAULTS.contact.description,
  keywords: PAGE_DEFAULTS.contact.keywords.split(", "),
  alternates: { canonical: "https://tribaldiscoverytour.com/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}
