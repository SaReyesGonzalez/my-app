import { z } from "zod/v4";

export const CancionSchema = z.object({
    id: z.uuid(),
    titulo: z.string().min(1).max(100),
    artistas: z.array(z.uuid()),
    duracion: z.number().positive(),
    urlArchivo: z.url(),
    genero: z.uuid(),
    albumId: z.uuid().optional()
});

export type Cancion = z.infer<typeof CancionSchema>;