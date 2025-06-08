import { Media } from "./Media";
  }
export class Cancion extends Media {
    private readonly artista: string;
    private readonly album: string;
    private readonly genero: string;


    constructor(
        id: string,
        titulo: string,
        duracion: number,
        public readonly artista: string,
        public readonly album?: string,
        public readonly genero?: string,
        public readonly anioLanzamiento?: number
    ) {
        super(id, "cancion", titulo, duracion);

    }