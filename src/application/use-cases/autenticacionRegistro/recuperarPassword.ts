import { UsuarioRepository } from "../../repositories/UsuarioRepository";

export class RecuperarPassword {
    constructor(private usuarioRepo: UsuarioRepository) { }

    async execute(params: { email: string, nuevaContraseñaHash: string }): Promise<void> {
        const usuario = await this.usuarioRepo.buscarPorEmail(params.email);
        if (!usuario) throw new Error("Usuario no encontrado.");

        usuario.cambiarContraseña(params.nuevaContraseñaHash);
        await this.usuarioRepo.actualizar(usuario);
    }
}