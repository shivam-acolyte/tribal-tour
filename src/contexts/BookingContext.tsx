"use client";

import React, { createContext, useContext, useState } from "react";
import { Tour } from "@/lib/types";

interface BookingContextType {
  isOpen: boolean;
  selectedTour: Tour | null;
  openBooking: (tour: Tour) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType>({
  isOpen: false,
  selectedTour: null,
  openBooking: () => {},
  closeBooking: () => {},
});

export const useBooking = () => useContext(BookingContext);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const openBooking = (tour: Tour) => {
    setSelectedTour(tour);
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedTour(null), 300);
  };

  return (
    <BookingContext.Provider value={{ isOpen, selectedTour, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
