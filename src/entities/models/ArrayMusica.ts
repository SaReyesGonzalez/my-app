/**
 * Clase base abstracta para listas musicales (álbumes, playlists).
 */
export abstract class ArrayMusica {
    protected readonly id: string;
    protected nombre: string;
    protected portadaUrl?: string;

    constructor(
        id: string,
        nombre: string,
        portada?: string,
    ) {
        this.id = id;
        this.nombre = nombre;
        this.portadaUrl = portada || "";
    }

    getId(): string {
        return this.id;
    }
    getNombre(): string {
        return this.nombre;
    }

    getPortadaUrl(): string {
        return this.portadaUrl || "";
    }

    setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    setPortadaUrl(portadaUrl: string): void {
        this.portadaUrl = portadaUrl;
    }

    /**
     * Método abstracto para obtener la cantidad de medios.
     */
    abstract getMediaCount(): number;

    /**
     * Método abstracto para limpiar el contenido.
     */
    abstract clearContenido(): void;
}