import { Media } from "./Media";

export class Podcast extends Media {
    constructor(
        id: string,
        titulo: string,
        duracion: number,
        public readonly anfitrion: string,
        public readonly episodios: number,
        public readonly descripcion?: string,
        public readonly categoria?: string,
        public readonly anioInicio?: number
    ) {
        super(id, "podcast", titulo, duracion);
    }
}