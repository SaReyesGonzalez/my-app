import { ContenidoRepository } from "../../application/repositories/contenidoRepository";
import { Media } from "../../entities/models/Media";

export class ContenidoRepositoryMemoria implements ContenidoRepository {
    private contenidos: Media[] = [];

    constructor(contenidosIniciales: Media[] = []) {
        this.contenidos = contenidosIniciales;
    }

    async buscarPorTexto(query: string): Promise<Media[]> {
        return this.contenidos.filter(c => c.getTitulo().toLowerCase().includes(query.toLowerCase()));
    }

    async obtenerRanking(generoId?: string): Promise<Media[]> {
        let filtrados = this.contenidos;
        if (generoId) {
            filtrados = filtrados.filter(c => c.getGeneroId() === generoId);
        }
        // Simula ranking por fecha de lanzamiento descendente
        return filtrados.sort((a, b) => b.getFechaLanzamiento().getTime() - a.getFechaLanzamiento().getTime());
    }

    async obtenerPorId(id: string): Promise<Media | null> {
        return this.contenidos.find(c => c.getId() === id) || null;
    }

    // Método auxiliar para agregar contenido en pruebas
    agregarContenido(media: Media): void {
        this.contenidos.push(media);
    }
} 