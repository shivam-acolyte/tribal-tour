export interface Tour {
  slug: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  isHidden?: boolean;
  image: string;
  images: string[];
  badge: string;
  category: string;
  groupSize: string;
  description: string;
  highlights: { icon: string; label: string }[];
  included: string[];
  excluded: string[];
  itinerary: { day: number; title: string; description: string; activities: string[]; meals: string[]; accommodation: string }[];
  reviews: { name: string; photo: string; date: string; rating: number; text: string; city: string }[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface Destination {
  name: string;
  country: string;
  flag: string;
  region: "India" | "South East Asia" | "International";
  image: string;
  tourCount: number;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  authorImage: string;
  authorBio?: string;
  date: string;
  readTime: string;
  isHidden?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  created_at?: string;
}
