import { ArrayMusica } from "./ArrayMusica";
import { Autor } from "./Autor";
import { Genero } from "./Genero";

type TipoMedia = "cancion" | "podcast";

export abstract class Media {
    private readonly id: string;
    private readonly tipo: TipoMedia; // Tipo de medio, puede ser "Canción", "Podcast", etc.
    private readonly titulo: string;
    private readonly duracion: number; // en segundos
    private readonly autor: Autor;
    private genero: Genero[];
    private almacenaje?: ArrayMusica;
    private nEpidodios?: number;

    constructor(
        id: string,
        tipo: TipoMedia,
        titulo: string,
        duracion: number, // en segundos
        autor: Autor, // Opcional, puede ser un artista o un anfitrión
        genero: Genero[], // Opcional, puede ser un array de géneros
        almacenaje: ArrayMusica, // Almacenamiento por defecto
        nEpidodios?: number // Número de episodios, opcional para podcasts
    ) {
        this.id = id;
        this.tipo = tipo;
        this.titulo = titulo;
        this.duracion = duracion;
        this.autor = autor;
        this.genero = genero;
        this.almacenaje = almacenaje;
        this.nEpidodios = nEpidodios;

        // Validación de los parámetros
        if (!this.id) throw new Error("El ID es requerido.");
        if (!this.titulo) throw new Error("El título es requerido.");
        if (this.duracion <= 0) throw new Error("La duración debe ser un número positivo.");
        if (!this.autor) throw new Error("El autor es requerido.");
    }

    // Getters
    getId() { return this.id; }
    getTipo() { return this.tipo; }
    getTitulo() { return this.titulo; }
    getDuracion() { return this.duracion; }
    getAutor() { return this.autor; }
    getGenero() { return this.genero; }
    getAlmacenaje() { return this.almacenaje; }
    getNEpisodios() { return this.nEpidodios; }

}