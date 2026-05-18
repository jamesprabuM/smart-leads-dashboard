import axios from 'axios';
import type { ApiResponse, Lead, LeadFilters, PaginationMeta, User } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data),
  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
};

export const leadsApi = {
  getAll: (filters: LeadFilters) =>
    api.get<ApiResponse<Lead[]>>('/leads', { params: filters }),
  getById: (id: string) => api.get<ApiResponse<Lead>>(`/leads/${id}`),
  create: (data: Partial<Lead>) => api.post<ApiResponse<Lead>>('/leads', data),
  update: (id: string, data: Partial<Lead>) =>
    api.put<ApiResponse<Lead>>(`/leads/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/leads/${id}`),
  exportCsv: (filters: Omit<LeadFilters, 'page'>) =>
    api.get('/leads/export', { params: filters, responseType: 'blob' }),
};

export type { PaginationMeta };
