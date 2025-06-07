import { z } from "zod/v4";

export const HistorialReproduccionSchema = z.object({
    id: z.uuid(),
    usuarioId: z.uuid(),
    mediaId: z.uuid(),
    tipo: z.enum(["cancion", "podcast"]),
    fechaReproduccion: z.date()
});

export type HistorialReproduccion = z.infer<typeof HistorialReproduccionSchema>;