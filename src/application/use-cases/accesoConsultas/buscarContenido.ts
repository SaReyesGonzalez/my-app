import { ContenidoRepository } from "../../repositories/contenidoRepository";
import { Media } from "../../../entities/models/Media";

export class BuscarContenido {
    constructor(private contenidoRepo: ContenidoRepository) { }

    async execute(params: { query: string }): Promise<Media[]> {
        return await this.contenidoRepo.buscarPorTexto(params.query);
    }
}
