import { Genero } from "./Genero";

export class Autor {
    private id: string;
    private nombre: string;
    private generos: Genero[];
    private descripcion?: string;
    private imagenUrl?: string;

    constructor(params: {
        id: string;
        nombre: string;
        generos: Genero[];
        descripcion?: string;
        imagenUrl?: string;
    }) {
        this.id = params.id;
        this.nombre = params.nombre;
        this.generos = params.generos;
        this.descripcion = params.descripcion;
        this.imagenUrl = params.imagenUrl;

        if (!this.id || !this.nombre || this.generos.length === 0) {
            throw new Error("ID, nombre y al menos un género son requeridos.");
        }
    }

    // Getters
    getId(): string {
        return this.id;
    }

    getNombre(): string {
        return this.nombre;
    }

    getGeneros(): Genero[] {
        return this.generos;
    }

    getDescripcion(): string | undefined {
        return this.descripcion;
    }

    getImagenUrl(): string | undefined {
        return this.imagenUrl;
    }

    // Métodos de dominio

    actualizarDescripcion(descripcion: string): void {
        this.descripcion = descripcion;
    }

    actualizarImagenUrl(imagenUrl: string): void {
        this.imagenUrl = imagenUrl;
    }
}