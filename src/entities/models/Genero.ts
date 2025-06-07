import { z } from "zod/v4";

export const GeneroSchema = z.object({
    id: z.string().uuid(),
    nombre: z.string().min(1).max(50),
    descripcion: z.string().max(200).optional(),
    imagenUrl: z.string().url().optional()
});

export type Genero = z.infer<typeof GeneroSchema>;