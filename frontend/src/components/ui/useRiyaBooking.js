import { createContext, useContext } from "react";

export const RiyaBookingContext = createContext(null);

export function useRiyaBooking() {
  const context = useContext(RiyaBookingContext);
  if (!context) {
    throw new Error("useRiyaBooking must be used inside RiyaBookingProvider");
  }
  return context;
}
