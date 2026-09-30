"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { BookingProvider } from "@/contexts/BookingContext";
import ScrollToTop from "@/components/layout/ScrollToTop";
import WelcomePopup from "@/components/shared/WelcomePopup";
import BookingModal from "@/components/shared/BookingModal";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";
import InstagramCTA from "@/components/shared/InstagramCTA";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && !pathname.startsWith("/admin")) {
      try {
        sessionStorage.removeItem("admin_auth_token");
        localStorage.removeItem("admin_auth_token");
      } catch {}
    }

    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const cleanPath = pathname === "/" ? "" : pathname;
      const canonicalUrl = `${origin}${cleanPath}`;
      let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", canonicalUrl);
    }
  }, [pathname]);

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BookingProvider>
          <ScrollToTop />
          {children}
          <Toaster />
          <Sonner />
          {!pathname?.startsWith("/admin") && <WelcomePopup />}
          <BookingModal />
          <InstagramCTA />
          <WhatsAppCTA />
        </BookingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
