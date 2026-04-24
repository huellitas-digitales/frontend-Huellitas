export interface Especie {
  id: number; // El backend nos devuelve un ID numérico
  nombre: string;
 createdAt: string; // Fecha en formato ISO
 updatedAt: string; // Fecha en formato ISO
 deletedAt: string | null; // Puede ser null si no ha sido eliminada
}