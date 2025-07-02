/**
 * Clase abstracta para medios musicales (canción, podcast, etc.).
 * Define la interfaz base para todos los tipos de media.
 */
export abstract class Media {
    protected readonly id: string;
    protected titulo: string;
    protected duracion: number; // en segundos
    protected autorId: string; // ID del autor
    protected generoId: string; // ID del género
    protected fechaLanzamiento: Date;

    constructor(params: {
        id: string;
        titulo: string;
        duracion: number;
        autorId: string;
        generoId: string;
        fechaLanzamiento: Date;
    }) {
        this.id = params.id;
        this.titulo = params.titulo;
        this.duracion = params.duracion;
        this.autorId = params.autorId;
        this.generoId = params.generoId;
        this.fechaLanzamiento = params.fechaLanzamiento;
    }

    getId(): string {
        return this.id;
    }

    getTitulo(): string {
        return this.titulo;
    }

    setTitulo(titulo: string): void {
        this.titulo = titulo;
    }

    getDuracion(): number {
        return this.duracion;
    }

    setDuracion(duracion: number): void {
        this.duracion = duracion;
    }

    getAutorId(): string {
        return this.autorId;
    }

    getGeneroId(): string {
        return this.generoId;
    }

    getFechaLanzamiento(): Date {
        return this.fechaLanzamiento;
    }

    setFechaLanzamiento(fecha: Date): void {
        this.fechaLanzamiento = fecha;
    }

    /**
     * Método abstracto para reproducir el medio.
     */
    abstract reproducir(): void;
}

/**
 * Error personalizado para la entidad Media.
 */
export class MediaError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MediaError";
    }
}