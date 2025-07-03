import { UsuarioRepository } from "../../repositories/UsuarioRepository";
import { PreferenciasUsuario } from "../../../entities/models/Usuario";

export class PreferenciasUsuarios {
    constructor(private usuarioRepo: UsuarioRepository) { }

    async execute(params: { usuarioId: string; preferencias: Partial<PreferenciasUsuario> }): Promise<void> {
        const usuario = await this.usuarioRepo.buscarPorId(params.usuarioId);
        if (!usuario) throw new Error("Usuario no encontrado");
        usuario.actualizarPreferencias(params.preferencias);
        await this.usuarioRepo.actualizar(usuario);
    }
}
