import { ArrayMusica } from "./ArrayMusica";
import { Media } from "./Media";

/**
 * Entidad Playlist.
 * Usa solo IDs para reducir acoplamiento.
 */
export class Playlist extends ArrayMusica {
    private readonly creadorId: string; // Solo ID
    private contenido: Media[];
    private esPublica: boolean;
    private descripcion?: string;

    constructor(
        id: string,
        nombre: string,
        creadorId: string,
        contenido: Media[],
        esPublica: boolean,
        portadaUrl?: string,
        descripcion?: string
    ) {
        super(id, nombre, portadaUrl);
        this.creadorId = creadorId;
        this.contenido = contenido;
        this.esPublica = esPublica;
        this.descripcion = descripcion;
    }

    getCreadorId(): string {
        return this.creadorId;
    }

    getContenido(): Media[] {
        return this.contenido;
    }

    setContenido(contenido: Media[]): void {
        this.contenido = contenido;
    }

    isPublica(): boolean {
        return this.esPublica;
    }

    setPublica(esPublica: boolean): void {
        this.esPublica = esPublica;
    }

    getDescripcion(): string | undefined {
        return this.descripcion;
    }

    setDescripcion(descripcion: string): void {
        this.descripcion = descripcion;
    }

    addMedia(media: Media): void {
        this.contenido.push(media);
    }

    removeMedia(media: Media): void {
        this.contenido = this.contenido.filter(m => m.getId() !== media.getId());
    }

    clearContenido(): void {
        this.contenido = [];
    }

    getMediaCount(): number {
        return this.contenido.length;
    }

    getMediaById(id: string): Media | undefined {
        return this.contenido.find(media => media.getId() === id);
    }

    /**
     * Reordena el contenido de la playlist.
     */
    reordenarContenido(nuevoOrden: string[]): void {
        this.contenido = nuevoOrden
            .map(id => this.contenido.find(c => c.getId() === id))
            .filter((c): c is Media => !!c);
    }

    /**
     * Cambia la privacidad de la playlist.
     */
    cambiarPrivacidad(esPublica: boolean): void {
        this.esPublica = esPublica;
    }
}