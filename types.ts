
export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  stock: number;
  active: boolean;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id?: number;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface PasswordReset {
  id: string;
  userId: number;
  code: string;
  expiresAt: number; // Timestamp for expiration
  used: boolean;
}

export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  items: OrderItem[];
  address: Address;
  trackingCode?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
}

export interface SiteSettings {
  siteName: string;
  logo?: string;
  defaultLogo?: string;
  whatsapp: string;
  email: string;
  maintenanceMode: boolean;
  bannerActive: boolean;
  homeHeroVisible: boolean;
}
