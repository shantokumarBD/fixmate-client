import { BookingStatus, PaymentStatus, ServiceCategory } from "@/constants/roles";

export interface StatusHistoryEntry {
  status: BookingStatus;
  changedAt: string;
  note?: string;
}

export interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: ServiceCategory;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  timeSlot?: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  paidAt?: string;
  transactionId?: string;
  statusHistory?: StatusHistoryEntry[];
  isReviewed?: boolean;
  review?: {
    rating: number;
    comment: string;
    reviewedAt: string;
  };
}

export interface CreateBookingInput {
  serviceId: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  timeSlot?: string;
  problemDescription: string;
}