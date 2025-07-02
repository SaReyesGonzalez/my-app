import { Media } from "./Media";

/**
 * Entidad Podcast, hereda de Media.
 */
export class Podcast extends Media {
    private episodios: EpisodioPodcast[];

    constructor(params: {
        id: string;
        titulo: string;
        duracion: number;
        autorId: string;
        generoId: string;
        fechaLanzamiento: Date;
        episodios?: EpisodioPodcast[];
    }) {
        super(params);
        this.episodios = params.episodios ?? [];
    }

    getEpisodios(): EpisodioPodcast[] {
        return [...this.episodios];
    }

    agregarEpisodio(episodio: EpisodioPodcast): void {
        this.episodios.push(episodio);
    }

    quitarEpisodio(episodioId: string): void {
        this.episodios = this.episodios.filter(e => e.id !== episodioId);
    }

    reproducir(): void {
        // Lógica para reproducir el podcast (puede ser el primer episodio, por ejemplo)
        // Por ejemplo: console.log(`Reproduciendo podcast: ${this.titulo}`);
    }
}

/**
 * Episodio de un podcast.
 */
export interface EpisodioPodcast {
    id: string;
    titulo: string;
    duracion: number; // en segundos
    descripcion?: string;
    fechaLanzamiento: Date;
}