"use client";

import { useBooking } from "@/contexts/BookingContext";
import Popup from "@/components/popup";

const BookingModal = () => {
  const { isOpen, selectedTour, closeBooking } = useBooking();
  return <Popup isOpen={isOpen} onClose={closeBooking} tour={selectedTour} />;
};

export default BookingModal;
