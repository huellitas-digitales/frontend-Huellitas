import api from '@/shared/lib/axios';
import { LoginCredentials, LoginResponse } from "../login.types"

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data; // Aquí esperamos recibir el token y la info del usuario
  }
};