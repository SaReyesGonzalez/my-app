import { UsuarioRepository } from "../../repositories/UsuarioRepository";

export class ValidarCredenciales {
    constructor(private usuarioRepo: UsuarioRepository) { }

    async execute(params: { email: string; contraseñaHash: string }): Promise<boolean> {
        const usuario = await this.usuarioRepo.buscarPorEmail(params.email);
        if (!usuario) return false;
        return usuario.getContraseñaHash() === params.contraseñaHash;
    }
}