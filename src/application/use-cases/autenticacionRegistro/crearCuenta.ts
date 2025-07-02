import { Usuario, UsuarioError } from "../../../entities/models/Usuario";
import { UsuarioRepository } from "../../repositories/UsuarioRepository";

export class CrearCuenta {
    constructor(private usuarioRepo: UsuarioRepository) { }

    async execute(params: { nombre: string; email: string; contraseñaHash: string }): Promise<Usuario> {
        // Validar si ya existe usuario con ese email
        const existente = await this.usuarioRepo.buscarPorEmail(params.email);
        if (existente) throw new UsuarioError("El email ya está registrado.");

        // Crear usuario
        const usuario = new Usuario({
            id: crypto.randomUUID(),
            rol: "usuario",
            nombre: params.nombre,
            email: params.email,
            contraseñaHash: params.contraseñaHash,
            fechaRegistro: new Date(),
            preferencias: { generosFavoritos: [], artistasFavoritos: [] }
        });

        await this.usuarioRepo.crear(usuario);
        return usuario;
    }
}