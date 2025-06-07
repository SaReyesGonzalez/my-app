import { z } from "zod/v4";

export const AlbumSchema = PlaylistSchema.extend({
    tipo: z.literal("album"),
    fechaLanzamiento: z.date(),
    discografica: z.string().min(1).optional()
});

export type Album = z.infer<typeof AlbumSchema>;