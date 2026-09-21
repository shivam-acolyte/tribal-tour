"use client";

import { MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/seo";

interface WhatsAppCTAProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export const WhatsAppCTA = ({
  phoneNumber = BRAND.phone,
  message = "Hi! I'm interested in tribal tours. Can you help me plan my trip?",
  className = ""
}: WhatsAppCTAProps) => {
  const normalizePhone = (value: string) => value.replace(/[^0-9]/g, "");

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${normalizePhone(phoneNumber)}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse ${className}`}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={24} />
    </button>
  );
};

export default WhatsAppCTA;