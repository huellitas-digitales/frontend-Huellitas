import api from "@/shared/lib/axios";

export interface Notificacion {
  id: string;
  tipoNotificacion: string;
  canalEnvio: string;
  cuerpoMensaje: string;
  estadoEnvio: string;
  idUsuarioFk: string | null;
  idCitaFk: string | null;
  idMascotaFk: string | null;
  usuario?: { id: string; nombres: string; apellidos: string; email: string } | null;
  mascota?: { id: string; nombre: string } | null;
  createdAt: string;
}

export const notificacionesService = {
  getAll: async (estado?: string): Promise<Notificacion[]> => {
    const { data } = await api.get<Notificacion[]>("/notificaciones", {
      params: estado ? { estado } : undefined,
    });
    return data;
  },
  getOne: async (id: string): Promise<Notificacion> => {
    const { data } = await api.get<Notificacion>(`/notificaciones/${id}`);
    return data;
  },
  reenviar: async (id: string): Promise<{ mensaje: string }> => {
    const { data } = await api.post<{ mensaje: string }>(`/notificaciones/${id}/reenviar`);
    return data;
  },
  ejecutarManual: async (): Promise<{ vacunas: string; citas: string; stock: string }> => {
    const { data } = await api.post('/notificaciones/scheduler/ejecutar-manual');
    return data;
  },
};
