import { Usuario } from "../../entities/models/Usuario";

export interface UsuarioRepository {
    crear(usuario: Usuario): Promise<void>;
    buscarPorEmail(email: string): Promise<Usuario | null>;
    buscarPorId(id: string): Promise<Usuario | null>;
    actualizar(usuario: Usuario): Promise<void>;
}