import { CrearCuenta } from "../../application/use-cases/autenticacionRegistro/crearCuenta";
import { IniciarSesion } from "../../application/use-cases/autenticacionRegistro/iniciarSesion";
import { ValidarCredenciales } from "../../application/use-cases/autenticacionRegistro/validarCredenciales";
import { RecuperarPassword } from "../../application/use-cases/autenticacionRegistro/recuperarPassword";
import { UsuarioRepository } from "../../application/repositories/UsuarioRepository";

// Recibe una implementación concreta del repositorio (puede ser mock, memoria, o real)
export class AuthController {
    constructor(private usuarioRepo: UsuarioRepository) { }

    async crearCuenta(reqBody: { nombre: string; email: string; contraseñaHash: string }) {
        const useCase = new CrearCuenta(this.usuarioRepo);
        return await useCase.execute(reqBody);
    }

    async iniciarSesion(reqBody: { email: string; contraseñaHash: string }) {
        const useCase = new IniciarSesion(this.usuarioRepo);
        return await useCase.execute(reqBody);
    }

    async validarCredenciales(reqBody: { email: string; contraseñaHash: string }) {
        const useCase = new ValidarCredenciales(this.usuarioRepo);
        return await useCase.execute(reqBody);
    }

    async recuperarPassword(reqBody: { email: string; nuevaContraseñaHash: string }) {
        const useCase = new RecuperarPassword(this.usuarioRepo);
        return await useCase.execute(reqBody);
    }
}