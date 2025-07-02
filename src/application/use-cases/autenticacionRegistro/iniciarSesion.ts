import { Usuario } from "../../../entities/models/Usuario";
import { UsuarioRepository } from "../../repositories/UsuarioRepository";

export class IniciarSesion {
    constructor(private usuarioRepo: UsuarioRepository) { }

    async execute(params: { email: string; contraseñaHash: string }): Promise<Usuario> {
        const usuario = await this.usuarioRepo.buscarPorEmail(params.email);
        if (!usuario) throw new Error("Usuario o contraseña incorrectos.");

        if (usuario.getContraseñaHash() !== params.contraseñaHash) {
            throw new Error("Usuario o contraseña incorrectos.");
        }

        return usuario;
    }
}