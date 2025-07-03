import { ContenidoRepository } from "../../repositories/contenidoRepository";
import { Media } from "../../../entities/models/Media";

export class ExplorarRanking {
    constructor(private contenidoRepo: ContenidoRepository) { }

    async execute(params: { generoId?: string } = {}): Promise<Media[]> {
        return await this.contenidoRepo.obtenerRanking(params.generoId);
    }
}
