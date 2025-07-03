import { UsuarioRepository } from "../../repositories/UsuarioRepository";
import { HistorialUsuario } from "../../../entities/models/Usuario";

export class HistorialReproducciones {
    constructor(private usuarioRepo: UsuarioRepository) { }

    async execute(params: { usuarioId: string; historial: HistorialUsuario }): Promise<void> {
        const usuario = await this.usuarioRepo.buscarPorId(params.usuarioId);
        if (!usuario) throw new Error("Usuario no encontrado");
        usuario.agregarAlHistorial(params.historial);
        await this.usuarioRepo.actualizar(usuario);
    }
}
