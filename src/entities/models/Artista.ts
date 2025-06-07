import { z } from "zod/v4";

export const ArtistaSchema = z.object({
  id: z.uuid(),
  nombre: z.string().min(1).max(100),
  generos: z.array(z.uuid()),
  imagenUrl: z.url().optional(),
  biografia: z.string().max(500).optional()
});

export type Artista = z.infer<typeof ArtistaSchema>;

