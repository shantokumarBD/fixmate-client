import { ApprovalStatus, ServiceCategory, ServiceMode } from "@/constants/roles";

export interface Review {
  reviewId: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Service {
  _id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: ApprovalStatus;
  isAvailable: boolean;
  createdAt: string;
  averageRating?: number;
  reviewCount?: number;
  reviews?: Review[];
}

export interface ServiceFilters {
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: "priceLowToHigh" | "priceHighToLow" | "newest" | string;
  page?: string | number;
  limit?: string | number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedServicesResponse {
  services: Service[];
  pagination: PaginationMeta;
}

export interface TechnicianSummary {
  name: string;
  image?: string;
  area?: string;
  bio?: string;
  phone?: string;
}

export interface ServiceDetail extends Service {
  technician?: TechnicianSummary;
}