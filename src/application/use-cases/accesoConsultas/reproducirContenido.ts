import { ContenidoRepository } from "../../repositories/contenidoRepository";
import { Media } from "../../../entities/models/Media";

export class ReproducirContenido {
    constructor(private contenidoRepo: ContenidoRepository) { }

    async execute(params: { id: string }): Promise<Media | null> {
        return await this.contenidoRepo.obtenerPorId(params.id);
    }
}
