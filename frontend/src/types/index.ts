// ── Category ──
export interface CategoryRequest {
  nameEn: string;
  nameAr: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CategoryResponse {
  id: string;
  nameEn: string;
  nameAr: string;
  displayOrder: number;
  isActive: boolean;
  menuItemCount: number;
}

// ── MenuItem ──
export interface MenuItemRequest {
  categoryId: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
}

export interface MenuItemResponse {
  id: string;
  categoryId: string;
  categoryNameEn: string;
  categoryNameAr: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ── Reservation ──
export interface CreateReservationRequest {
  customerName: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  partySize: number;
  specialRequests?: string;
}

export interface UpdateReservationStatusRequest {
  status: ReservationStatus;
}

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface ReservationResponse {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  partySize: number;
  specialRequests?: string;
  status: string;
  whatsAppNotified: boolean;
  createdAt: string;
}

// ── ContactMessage ──
export interface ContactMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ── Auth ──
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
}

// ── API Error ──
export interface ApiError {
  detail: string;
  status?: number;
}
