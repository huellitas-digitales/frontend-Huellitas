import { create } from "domain";
import { z } from "zod";

// --- REGLAS REUTILIZABLES ---
export const globalRules = {
  id: z.coerce.number().positive(),
  // Evita que peguen 500 palabras donde va un nombre
  name: z.string()
    .min(2, "Demasiado corto")
    .max(60, "Máximo 60 caracteres"),
  // Para descripciones largas (Diagnósticos, Notas)
  description: z.string()
    .min(5, "Por favor sé más detallado")
    .max(1500, "Límite de 1500 caracteres excedido"),
  phone: z.string().regex(/^[67]\d{7}$/, "Número de Bolivia inválido"),
  positiveNum: z.coerce.number().min(0, "No puede ser negativo"),
};

// --- ESQUEMAS EJEMPLO ---
export const petSchema = z.object({
  nombre: globalRules.name,
  especie: z.string().min(1, "Requerido"),
  peso: globalRules.positiveNum,
  observaciones: globalRules.description.optional(),
});

export const productSchema = z.object({
  nombre: globalRules.name,
  precio: globalRules.positiveNum,
  stock: z.coerce.number().int().min(0),
});

export const especieSchema = z.object({
  nombre: z.string()
    .min(2, "El nombre debe tener al menos 2 letras")
    .max(50, "El nombre es demasiado largo"),
});

// Extraemos el tipo solo para el formulario (sin el ID, porque el ID lo crea la base de datos)
export type EspecieFormData = z.infer<typeof especieSchema>;