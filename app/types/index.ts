export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  businessId: number;
}

export interface Business {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  createdBy: number;
  businessId: number;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'editor' | 'approver' | 'viewer';
export type ProductStatus = 'draft' | 'pending_approval' | 'approved';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}