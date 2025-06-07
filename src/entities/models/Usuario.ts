import { z } from "zod/v4";

export const UsuarioSchema = z.object({
    id: z.uuid(),
    rol: z.enum(["invitado", "usuario", "admin"]),
    nombre: z.string().min(2).max(50),
    email: z.email(),
    contraseñaHash: z.string().min(6),
    fechaRegistro: z.date(),
    preferencias: z.object({
        generosFavoritos: z.array(z.uuid()),
        artistasFavoritos: z.array(z.uuid())
    }).optional()
});

export type Usuario = z.infer<typeof UsuarioSchema>;