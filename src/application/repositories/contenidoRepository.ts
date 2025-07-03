import { Media } from "../../entities/models/Media";

export interface ContenidoRepository {
    buscarPorTexto(query: string): Promise<Media[]>;
    obtenerRanking(generoId?: string): Promise<Media[]>;
    obtenerPorId(id: string): Promise<Media | null>;
}
