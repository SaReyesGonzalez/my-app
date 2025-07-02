import { Usuario } from "../../entities/models/Usuario";
import { UsuarioRepository } from "../../application/repositories/UsuarioRepository";

export class UsuarioRepositoryMemoria implements UsuarioRepository {
    private usuarios: Usuario[] = [];

    async crear(usuario: Usuario): Promise<void> {
        this.usuarios.push(usuario);
    }

    async buscarPorEmail(email: string): Promise<Usuario | null> {
        return this.usuarios.find(u => u.getEmail() === email) || null;
    }

    async buscarPorId(id: string): Promise<Usuario | null> {
        return this.usuarios.find(u => u.getId() === id) || null;
    }

    async actualizar(usuario: Usuario): Promise<void> {
        const idx = this.usuarios.findIndex(u => u.getId() === usuario.getId());
        if (idx !== -1) this.usuarios[idx] = usuario;
    }
}