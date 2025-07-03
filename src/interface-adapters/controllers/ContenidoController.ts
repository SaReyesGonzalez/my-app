import { BuscarContenido } from "../../application/use-cases/accesoConsultas/buscarContenido";
import { ExplorarRanking } from "../../application/use-cases/accesoConsultas/explorarRanking";
import { ReproducirContenido } from "../../application/use-cases/accesoConsultas/reproducirContenido";
import { ContenidoRepository } from "../../application/repositories/contenidoRepository";

export class ContenidoController {
    constructor(private contenidoRepo: ContenidoRepository) { }

    async buscarContenido(params: { query: string }) {
        const useCase = new BuscarContenido(this.contenidoRepo);
        return await useCase.execute(params);
    }

    async explorarRanking(params: { generoId?: string }) {
        const useCase = new ExplorarRanking(this.contenidoRepo);
        return await useCase.execute(params);
    }

    async reproducirContenido(params: { id: string }) {
        const useCase = new ReproducirContenido(this.contenidoRepo);
        return await useCase.execute(params);
    }
}
