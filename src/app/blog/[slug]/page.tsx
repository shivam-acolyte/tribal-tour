import { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";
import { blogs } from "@/lib/data/blogs";
import { BRAND } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) {
    return { title: ` ${BRAND.name}` };
  }
  return {
    title: blog.seoTitle || `${blog.title} | ${BRAND.name}`,
    description: blog.seoDescription || blog.excerpt,
    keywords: blog.seoKeywords?.split(", "),
    alternates: { canonical: `${BRAND.url}/blog/${blog.slug}` },
    authors: [{ name: blog.author }],
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [{ url: blog.image, alt: blog.title }],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
