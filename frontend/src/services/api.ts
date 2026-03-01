import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import type {
  CategoryRequest, CategoryResponse,
  MenuItemRequest, MenuItemResponse,
  CreateReservationRequest, UpdateReservationStatusRequest, ReservationResponse,
  ContactMessageRequest, ContactMessageResponse,
  LoginRequest, RegisterRequest, AuthResponse,
  ReservationStatus,
} from '@/types';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then(r => r.data),
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data).then(r => r.data),
};

// ── Categories ──
export const categoriesApi = {
  getAll: () =>
    api.get<CategoryResponse[]>('/categories').then(r => r.data),
  getActive: () =>
    api.get<CategoryResponse[]>('/categories/active').then(r => r.data),
  getById: (id: string) =>
    api.get<CategoryResponse>(`/categories/${id}`).then(r => r.data),
  create: (data: CategoryRequest) =>
    api.post<CategoryResponse>('/categories', data).then(r => r.data),
  update: (id: string, data: CategoryRequest) =>
    api.put<CategoryResponse>(`/categories/${id}`, data).then(r => r.data),
  delete: (id: string) =>
    api.delete(`/categories/${id}`),
};

// ── Menu Items ──
export const menuItemsApi = {
  getAll: () =>
    api.get<MenuItemResponse[]>('/menu-items').then(r => r.data),
  getByCategory: (categoryId: string) =>
    api.get<MenuItemResponse[]>(`/menu-items/category/${categoryId}`).then(r => r.data),
  getFeatured: () =>
    api.get<MenuItemResponse[]>('/menu-items/featured').then(r => r.data),
  getById: (id: string) =>
    api.get<MenuItemResponse>(`/menu-items/${id}`).then(r => r.data),
  create: (data: MenuItemRequest) =>
    api.post<MenuItemResponse>('/menu-items', data).then(r => r.data),
  update: (id: string, data: MenuItemRequest) =>
    api.put<MenuItemResponse>(`/menu-items/${id}`, data).then(r => r.data),
  delete: (id: string) =>
    api.delete(`/menu-items/${id}`),
};

// ── Reservations ──
export const reservationsApi = {
  getAll: () =>
    api.get<ReservationResponse[]>('/reservations').then(r => r.data),
  getByDate: (date: string) =>
    api.get<ReservationResponse[]>(`/reservations/date/${date}`).then(r => r.data),
  getByStatus: (status: ReservationStatus) =>
    api.get<ReservationResponse[]>(`/reservations/status/${status}`).then(r => r.data),
  getById: (id: string) =>
    api.get<ReservationResponse>(`/reservations/${id}`).then(r => r.data),
  create: (data: CreateReservationRequest) =>
    api.post<ReservationResponse>('/reservations', data).then(r => r.data),
  updateStatus: (id: string, data: UpdateReservationStatusRequest) =>
    api.patch<ReservationResponse>(`/reservations/${id}/status`, data).then(r => r.data),
  delete: (id: string) =>
    api.delete(`/reservations/${id}`),
};

// ── Contact Messages ──
export const contactMessagesApi = {
  getAll: () =>
    api.get<ContactMessageResponse[]>('/contact-messages').then(r => r.data),
  getUnread: () =>
    api.get<ContactMessageResponse[]>('/contact-messages/unread').then(r => r.data),
  getById: (id: string) =>
    api.get<ContactMessageResponse>(`/contact-messages/${id}`).then(r => r.data),
  create: (data: ContactMessageRequest) =>
    api.post<ContactMessageResponse>('/contact-messages', data).then(r => r.data),
  markAsRead: (id: string) =>
    api.patch(`/contact-messages/${id}/read`),
  delete: (id: string) =>
    api.delete(`/contact-messages/${id}`),
};

export default api;
