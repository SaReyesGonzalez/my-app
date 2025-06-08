import { Artista } from "./Artista";
import { Genero } from "./Genero";

export class Album extends ArrayMusica {
    private readonly artistaId: Artista["id"];
    private readonly genero: Genero;
    private readonly fechaCreacion: Date;
    private readonly discografica: string; // Opcional

    constructor(params: {
        id: string;
        nombre: string;
        canciones: Cancion[];
        portada?: string;
        artistaId: Artista["id"];
        genero: Genero;
        fechaCreacion: Date;
        discografica?: string; // Opcional
    }) {
        super({
            id: params.id,
            nombre: params.nombre,
            canciones: params.canciones,
            portada: params.portada,
        });
        this.artistaId = params.artistaId;
        this.genero = params.genero;
        this.fechaCreacion = params.fechaCreacion;
        this.discografica = params.discografica || "";
    }
}