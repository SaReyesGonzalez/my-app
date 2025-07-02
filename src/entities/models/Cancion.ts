import { Media } from "./Media";

/**
 * Entidad Cancion, hereda de Media.
 */
export class Cancion extends Media {
    private albumId?: string; // Opcional: ID del álbum al que pertenece
    private letra?: string;

    constructor(params: {
        id: string;
        titulo: string;
        duracion: number;
        autorId: string;
        generoId: string;
        fechaLanzamiento: Date;
        albumId?: string;
        letra?: string;
    }) {
        super(params);
        this.albumId = params.albumId;
        this.letra = params.letra;
    }

    getAlbumId(): string | undefined {
        return this.albumId;
    }

    setAlbumId(albumId: string): void {
        this.albumId = albumId;
    }

    getLetra(): string | undefined {
        return this.letra;
    }

    setLetra(letra: string): void {
        this.letra = letra;
    }

    reproducir(): void {
        // Lógica para reproducir la canción
        // Por ejemplo: console.log(`Reproduciendo canción: ${this.titulo}`);
    }
}