import { ApprovalStatus, ServiceCategory, ServiceMode } from "@/constants/roles";


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
}

export interface ServiceFilters {
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: "price-asc" | "price-desc" | "newest";
  limit?: number;
}