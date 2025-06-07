import { z } from "zod/v4";

export const PodcastSchema = z.object({
    id: z.string().uuid(),
    titulo: z.string().min(1).max(100),
    autor: z.string().min(1).max(100),
    categoria: z.string().min(1),
    duracion: z.number().positive(),
    urlArchivo: z.string().url()
});

export type Podcast = z.infer<typeof PodcastSchema>;