import { UserRole } from "@/constants/roles";

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  phone?: string;
  area?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}