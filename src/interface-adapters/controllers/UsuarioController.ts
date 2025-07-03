import { GuardarFavoritos } from "../../application/use-cases/gestionUsuario/guardarFavoritos";
import { HistorialReproducciones } from "../../application/use-cases/gestionUsuario/historialReproducciones";
import { PreferenciasUsuarios } from "../../application/use-cases/gestionUsuario/preferenciasUsuarios";
import { UsuarioRepository } from "../../application/repositories/UsuarioRepository";

export class UsuarioController {
    constructor(private usuarioRepo: UsuarioRepository) { }

    async guardarFavoritos(params: { usuarioId: string; contenidoId: string }) {
        const useCase = new GuardarFavoritos(this.usuarioRepo);
        return await useCase.execute(params);
    }

    async historialReproducciones(params: { usuarioId: string; historial: any }) {
        const useCase = new HistorialReproducciones(this.usuarioRepo);
        return await useCase.execute(params);
    }

    async preferenciasUsuarios(params: { usuarioId: string; preferencias: any }) {
        const useCase = new PreferenciasUsuarios(this.usuarioRepo);
        return await useCase.execute(params);
    }
}
