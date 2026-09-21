import { Metadata } from "next";
import BlogClient from "./BlogClient";
import { PAGE_DEFAULTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: PAGE_DEFAULTS.blog.title,
  description: PAGE_DEFAULTS.blog.description,
  keywords: PAGE_DEFAULTS.blog.keywords.split(", "),
  alternates: { canonical: "https://tribaldiscoverytour.com/blog" },
};

export default function BlogPage() {
  return <BlogClient />;
}
