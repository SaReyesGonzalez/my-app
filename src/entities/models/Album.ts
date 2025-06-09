import { Autor } from "./Autor";
import { Genero } from "./Genero";
import { ArrayMusica } from "./ArrayMusica";
import { Media } from "./Media";

export class Album extends ArrayMusica {
    private readonly artistaId: Autor["id"];
    private canciones: Media[];
    private readonly genero: Genero;
    private readonly fechaCreacion: Date;
    private readonly discografica?: string; // Opcional

    constructor(
        id: string,
        nombre: string,
        canciones: Media[],
        artistaId: Autor["id"],
        genero: Genero,
        fechaCreacion: Date,
        portada?: string,
        discografica?: string // Opcional
    ) {
        super(id, nombre, portada);
        this.canciones = canciones;
        this.artistaId = artistaId;
        this.genero = genero;
        this.fechaCreacion = fechaCreacion;
        this.discografica = discografica || "";
    }

    getArtistaId(): Autor["id"] {
        return this.artistaId;
    }

    getGenero(): Genero {
        return this.genero;
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


}