import { Artista } from "./Artista";

export type TipoMedia = "cancion" | "podcast";

export abstract class Media {
    private id: string;
    private tipo: TipoMedia;
    private titulo: string;
    private duracion: number; // en segundos
    //private artista: Artista;

    constructor(params: {
        id: string;
        tipo: TipoMedia;
        titulo: string;
        duracion: number;  // en segundos
    }) {
        this.id = params.id;
        this.tipo = params.tipo;
        this.titulo = params.titulo;
        this.duracion = params.duracion;

        // Validación de los parámetros
        if (!this.id) throw new Error("El ID es requerido.");
        if (!this.tipo) throw new Error("El tipo de media es requerido.");
        if (!this.titulo) throw new Error("El título es requerido.");
        if (this.duracion <= 0) throw new Error("La duración debe ser un número positivo.");
    }

    // Getters
    getId() { return this.id; }
    getTipo() { return this.tipo; }
    getTitulo() { return this.titulo; }
    getDuracion() { return this.duracion; }

    // Métodos de dominio



}