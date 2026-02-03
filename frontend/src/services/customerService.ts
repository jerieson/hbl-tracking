import axios from 'axios';
import { Customer, CustomerFilters } from '../types/customer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const customerService = {
  async getAll(filters?: CustomerFilters) {
    const params = new URLSearchParams();
    
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    
    if (filters?.tapped !== undefined && filters.tapped !== 'all') {
      params.append('tapped', String(filters.tapped));
    }
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    
    if (filters?.area) {
      params.append('area', filters.area);
    }

    const response = await api.get<{ success: boolean; data: Customer[]; count: number }>(
      `/api/customers?${params.toString()}`
    );
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get<{ success: boolean; data: Customer }>(
      `/api/customers/${id}`
    );
    return response.data;
  },

  async create(customer: Partial<Customer>) {
    const response = await api.post<{ success: boolean; message: string; data: { id: number } }>(
      '/api/customers',
      customer
    );
    return response.data;
  },

  async update(id: number, customer: Partial<Customer>) {
    const response = await api.put<{ success: boolean; message: string }>(
      `/api/customers/${id}`,
      customer
    );
    return response.data;
  },

  async delete(id: number) {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/api/customers/${id}`
    );
    return response.data;
  },

  async getAreas() {
    const response = await api.get<{ success: boolean; data: string[] }>(
      '/api/customers/areas'
    );
    return response.data;
  },
};