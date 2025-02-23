import axios from 'axios';
import { Building } from '@/types';

const api = axios.create({
  baseURL: '/api'
});

export const buildingsApi = {
  getAll: async () => {
    const response = await api.get<Building[]>('/buildings');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Building>(`/buildings/${id}`);
    return response.data;
  },

  create: async (building: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Building>('/buildings', building);
    return response.data;
  },

  update: async (id: string, building: Partial<Building>) => {
    const response = await api.put<Building>(`/buildings/${id}`, building);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/buildings/${id}`);
  }
};