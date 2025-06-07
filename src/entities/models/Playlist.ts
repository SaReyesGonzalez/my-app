import { z } from "zod/v4";

export const PlaylistSchema = z.object({
    id: z.string().uuid(),
    nombre: z.string().min(1).max(100),
    canciones: z.array(z.string().uuid()),
    creadorId: z.string().uuid(),
    tipo: z.enum(["usuario", "album"]),
    esPublica: z.boolean(),
    portadaUrl: z.string().url().optional()
});

export type Playlist = z.infer<typeof PlaylistSchema>;