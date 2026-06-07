import api from '@/shared/lib/axios';
import { LoginCredentials, LoginResponse } from "../login.types"

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  verificarPassword: async (password: string): Promise<{ ok: boolean }> => {
    const { data } = await api.post<{ ok: boolean }>('/auth/verificar-password', { password });
    return data;
  },
};