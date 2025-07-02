import { ArrayMusica } from "./ArrayMusica";
import { Media } from "./Media";

/**
 * Entidad Álbum musical.
 * Usa solo IDs para reducir acoplamiento.
 */
export class Album extends ArrayMusica {
    private readonly artistaId: string; // Solo ID
    private canciones: Media[];
    private readonly generoId: string; // Solo ID
    private readonly fechaCreacion: Date;
    private readonly discografica?: string;

    constructor(
        id: string,
        nombre: string,
        canciones: Media[],
        artistaId: string,
        generoId: string,
        fechaCreacion: Date,
        portada?: string,
        discografica?: string
    ) {
        super(id, nombre, portada);
        this.canciones = canciones;
        this.artistaId = artistaId;
        this.generoId = generoId;
        this.fechaCreacion = fechaCreacion;
        this.discografica = discografica || "";
    }

    getArtistaId(): string {
        return this.artistaId;
    }

    getGeneroId(): string {
        return this.generoId;
    }

    getFechaCreacion(): Date {
        return this.fechaCreacion;
    }

    getDiscografica(): string | undefined {
        return this.discografica;
    }

    addMedia(media: Media): void {
        this.canciones.push(media);
    }

    removeMedia(media: Media): void {
        this.canciones = this.canciones.filter(m => m.getId() !== media.getId());
    }

    getCanciones(): Media[] {
        return this.canciones;
    }

    getMediaCount(): number {
        return this.canciones.length;
    }

    clearContenido(): void {
        this.canciones = [];
    }

    /**
     * Reordena las canciones del álbum.
     */
    reordenarCanciones(nuevoOrden: string[]): void {
        this.canciones = nuevoOrden
            .map(id => this.canciones.find(c => c.getId() === id))
            .filter((c): c is Media => !!c);
    }
}