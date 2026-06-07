import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { LoginCredentials } from '../login.types';
import { toast } from 'sonner';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Extraemos las funciones de nuestra "Memoria Global" (Zustand)
  const setLogin = useAuthStore((state) => state.setLogin);
  const logoutState = useAuthStore((state) => state.logout);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      // 1. Mandamos al mensajero al backend
      const response = await authService.login(credentials);

      // 2. Limpiamos el caché de React Query del usuario anterior
      queryClient.clear();

      // 3. Guardamos los datos en la Memoria Global (Zustand)
      console.log('Token del usuario:', response.access_token);
      console.log('Usuario:', response.usuario);
      setLogin(response.usuario, response.access_token);

      // 3. Guardamos la cookie para que el Middleware de Next.js la lea y proteja las rutas
      document.cookie = `usuario_token=${response.access_token}; path=/; max-age=86400;`;

      // 4. Celebramos
      toast.success(`¡Bienvenido de vuelta, ${response.usuario.nombres}!`);

      // 5. Redirigimos al usuario a la zona correcta según su rol (RBAC)
      switch (response.usuario.rol.id) {
        case  1: // ADMIN
          router.push('/admin/dashboard'); 
          break;
        case 2: 
          router.push('/vet/agenda'); 
          break;
        case 3: 
          router.push('/caja/pos'); 
          break;
        case 4: 
          router.push('/cliente/inicio'); 
          break;
        default: 
          router.push('/');
      }
    } catch (error: any) {
      // El Interceptor de Axios (que configuramos antes) ya se encarga de mostrar 
      // el toast de error general, pero puedes manejar lógicas extra aquí si quieres.
      console.error("Fallo en el Login:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // 1. Limpiamos el caché de React Query
    queryClient.clear();

    // 2. Borramos la memoria en Zustand y limpiamos la cookie
    logoutState();
    
    // 2. Avisamos
    toast.info("Has cerrado sesión correctamente.");
    
    // 3. Lo pateamos al login
    router.push('/login');
  };

  return { login, logout, loading };
}