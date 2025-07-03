import { UsuarioRepository } from "../../repositories/UsuarioRepository";

export class GuardarFavoritos {
    constructor(private usuarioRepo: UsuarioRepository) { }

    async execute(params: { usuarioId: string; contenidoId: string }): Promise<void> {
        const usuario = await this.usuarioRepo.buscarPorId(params.usuarioId);
        if (!usuario) throw new Error("Usuario no encontrado");
        usuario.agregarFavorito(params.contenidoId);
        await this.usuarioRepo.actualizar(usuario);
    }
}
