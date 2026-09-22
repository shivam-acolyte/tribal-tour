/**
 * SEO Configuration and Utilities
 * Tribal Discovery Tour - Authentic Tribal Tourism in India
 */

// Brand Information
export const BRAND = {
  name: "Tribal Discovery Tour",
  shortName: "TDT",
  description: "Authentic tribal tourism experiences in Rajasthan, Odisha, Gujarat, and Northeast India",
  url: "https://tribaldiscoverytour.com",
  image: "https://tribaldiscoverytour.com/og-image.jpg", // Update with your actual image URL
  email: "info@tribaldiscoverytour.com",
  phone: "+919436045075",
  address: {
    streetAddress: "Jaipur",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    postalCode: "302001",
    addressCountry: "IN"
  },
  social: {
    twitter: "@TribalDiscovery", // Update with your actual Twitter handle
    instagram: "@tribal.discovery.tour", // Update with your actual Instagram
    facebook: "TribalDiscoveryTour" // Update with your actual Facebook
  }
};

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  author?: string;
  datePublished?: string;
  dateModified?: string;
  articleSection?: string;
}

/**
 * Generate complete SEO metadata for a page
 */
export function generateSEOMetadata(
  pageTitle: string,
  pageDescription: string,
  options?: {
    keywords?: string;
    image?: string;
    url?: string;
    type?: SEOMetadata["type"];
    author?: string;
    datePublished?: string;
    dateModified?: string;
    articleSection?: string;
  }
): SEOMetadata {
  return {
    title: `${pageTitle} | ${BRAND.name}`,
    description: pageDescription,
    keywords: options?.keywords,
    image: options?.image || BRAND.image,
    url: options?.url || BRAND.url,
    type: options?.type || "website",
    author: options?.author,
    datePublished: options?.datePublished,
    dateModified: options?.dateModified,
    articleSection: options?.articleSection
  };
}

/**
 * Generate JSON-LD Schema Markup for Travel Agency
 */
export function generateTravelAgencySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: BRAND.name,
    description: BRAND.description,
    url: BRAND.url,
    telephone: BRAND.phone,
    email: BRAND.email,
    image: BRAND.image,
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.address.streetAddress,
      addressLocality: BRAND.address.addressLocality,
      addressRegion: BRAND.address.addressRegion,
      postalCode: BRAND.address.postalCode,
      addressCountry: BRAND.address.addressCountry
    },
    sameAs: [
      `https://twitter.com/${BRAND.social.twitter.replace("@", "")}`,
      `https://www.instagram.com/${BRAND.social.instagram.replace("@", "")}`,
      `https://www.facebook.com/${BRAND.social.facebook}`
    ],
    priceRange: "₹₹-₹₹₹₹",
    areaServed: ["IN"],
    knowsAbout: ["Tribal Tourism", "Adventure Tours", "Cultural Tours", "Heritage Tourism"],
    parentOrganization: {
      "@type": "Organization",
      name: BRAND.name
    }
  };
}

/**
 * Generate JSON-LD Schema for Organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: BRAND.url,
    logo: BRAND.image,
    description: BRAND.description,
    telephone: BRAND.phone,
    email: BRAND.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: BRAND.address.addressLocality,
      addressRegion: BRAND.address.addressRegion,
      addressCountry: BRAND.address.addressCountry
    },
    sameAs: [
      `https://twitter.com/${BRAND.social.twitter.replace("@", "")}`,
      `https://www.instagram.com/${BRAND.social.instagram.replace("@", "")}`,
      `https://www.facebook.com/${BRAND.social.facebook}`
    ]
  };
}

/**
 * Generate JSON-LD Schema for FAQ Page
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate JSON-LD Schema for Breadcrumb Navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Generate JSON-LD Schema for Review/Rating
 */
export function generateReviewSchema(review: {
  ratingValue: number;
  ratingCount: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    ratingValue: review.ratingValue,
    bestRating: review.bestRating || 5,
    worstRating: review.worstRating || 1,
    ratingCount: review.ratingCount,
    reviewCount: review.reviewCount
  };
}

/**
 * Generate JSON-LD Schema for Product/Tour
 */
export function generateTourSchema(tour: {
  name: string;
  description: string;
  image: string;
  price: number;
  priceCurrency?: string;
  location: string;
  duration: string;
  ratingValue: number;
  ratingCount: number;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tour.name,
    description: tour.description,
    image: tour.image,
    url: tour.url,
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: tour.priceCurrency || "INR",
      availability: "https://schema.org/InStock"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tour.ratingValue,
      ratingCount: tour.ratingCount
    }
  };
}

/**
 * Generate JSON-LD Schema for Blog Article
 */
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: BRAND.name,
      logo: {
        "@type": "ImageObject",
        url: BRAND.image
      }
    },
    url: article.url
  };
}

/**
 * Default SEO metadata for different page types
 */
export const PAGE_DEFAULTS = {
  home: {
    title: "Authentic Tribal Tours in India | Expert-Led Experiences",
    description: "Discover authentic tribal experiences in Rajasthan, Odisha, Gujarat & Northeast India. Expert guides, sustainable practices, and immersive cultural connections.",
    keywords: "tribal tours India, authentic tribal experiences, Rajasthan tribal tours, Odisha tribal tours, cultural tourism, adventure tours, tribal villages"
  },
  tours: {
    title: "Tribal Tours & Packages | Book Your Adventure Today",
    description: "Browse curated tribal tourism packages across India's most culturally rich regions. Expert guides, authentic village experiences, guaranteed memories.",
    keywords: "tribal tours, India tribal packages, booking tribal tour, Rajasthan tribal tour, Odisha tribal tour, Northeast tribal tours, cultural tours"
  },
  destinations: {
    title: "Tribal Tourism Destinations in India | Region Guide",
    description: "Explore authentic tribal regions: Rajasthan (Bhil, Rabari), Odisha (Kondh, Bonda), Northeast (Naga, Mishing), Gujarat (Adivasi), Chhattisgarh (Gond).",
    keywords: "tribal destinations, tribal regions India, tribal tourism spots, travel guides, Rajasthan tribes, Odisha tribes, Northeast tribes"
  },
  activities: {
    title: "Tribal Activities & Experiences | Cultural Immersion",
    description: "Engage in authentic tribal activities: village walks, art workshops, traditional cooking, cultural performances, forest treks, homestays.",
    keywords: "tribal activities, tribal experiences, cultural immersion, village tours, traditional workshops, tribal activities India"
  },
  packages: {
    title: "Tribal Tour Packages | 3-7 Day Itineraries",
    description: "Choose from ready-made tribal tour packages (3-15 days) or customize. All-inclusive: accommodation, guides, meals, cultural activities.",
    keywords: "tribal tour packages, India travel packages, tribal itineraries, ready-made tours, custom tours, tour booking"
  },
  about: {
    title: "About Tribal Discovery Tour | Our Mission & Team",
    description: "Learn our story: committed to authentic, sustainable tribal tourism that empowers local communities while providing transformative travel experiences.",
    keywords: "about Tribal Discovery Tour, our mission, tribal tourism company, sustainable travel, responsible tourism company"
  },
  contact: {
    title: "Contact Tribal Discovery Tour | Get in Touch",
    description: "Contact us for tribal tour inquiries, custom bookings, group tours. Phone, email, WhatsApp - available 24/7 for your tour planning.",
    keywords: "contact tribal discovery tour, tribal tour inquiry, booking support, customer service, WhatsApp chat"
  },
  blog: {
    title: "Tribal Travel Blog | Tips, Guides & Stories",
    description: "Read travel guides, cultural insights, tribal stories, photography tips & destination guides. Learn before you travel.",
    keywords: "travel blog, tribal culture blog, travel tips, destination guides, cultural stories, travel advice"
  }
};

/**
 * Generate JSON-LD Schema for Local Business
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BRAND.name,
    description: BRAND.description,
    url: BRAND.url,
    telephone: BRAND.phone,
    email: BRAND.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.address.streetAddress,
      addressLocality: BRAND.address.addressLocality,
      addressRegion: BRAND.address.addressRegion,
      postalCode: BRAND.address.postalCode,
      addressCountry: BRAND.address.addressCountry
    },
    image: BRAND.image,
    priceRange: "₹₹-₹₹₹₹",
    areaServed: ["IN"],
    serviceType: ["Tour Operator", "Travel Agency", "Adventure Tours"],
    sameAs: [
      `https://twitter.com/${BRAND.social.twitter.replace("@", "")}`,
      `https://www.instagram.com/${BRAND.social.instagram.replace("@", "")}`,
      `https://www.facebook.com/${BRAND.social.facebook}`
    ]
  };
}

/**
 * Generate JSON-LD Schema for Event
 */
export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  location: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    image: event.image,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN"
      }
    },
    url: event.url,
    organizer: {
      "@type": "Organization",
      name: BRAND.name,
      url: BRAND.url
    }
  };
}
