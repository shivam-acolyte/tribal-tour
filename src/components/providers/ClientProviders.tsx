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

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && !pathname.startsWith("/admin")) {
      try {
        sessionStorage.removeItem("admin_auth_token");
        localStorage.removeItem("admin_auth_token");
      } catch {}
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
          <WhatsAppCTA />
        </BookingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
