import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Así es exactamente como viene del backend
export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  rol: {
    id: number;
    nombre: string;
  };
}

interface AuthState {
  user: User | null;
  access_token: string | null;
  setLogin: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      access_token: null,
      setLogin: (user, access_token) => {
  set({ user, access_token });
  // Seteamos la cookie para que el middleware de Next.js la lea
  document.cookie = `usuario_token=${access_token}; path=/; max-age=86400; secure; samesite=strict`;
},
      logout: () => {
        set({ user: null, access_token: null });
        document.cookie = "usuario_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      },
    }),
    { name: 'huellitas-auth' }
  )
);