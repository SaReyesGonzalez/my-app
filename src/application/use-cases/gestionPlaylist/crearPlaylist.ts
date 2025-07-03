import { PlaylistRepository } from "../../repositories/PlaylistRepository";
import { Playlist } from "../../../entities/models/Playlist";

export class CrearPlaylist {
    constructor(private playlistRepo: PlaylistRepository) { }

    async execute(params: {
        id: string;
        nombre: string;
        creadorId: string;
        contenido: any[]; // IDs o instancias de Media, según tu flujo
        esPublica: boolean;
        portadaUrl?: string;
        descripcion?: string;
    }): Promise<void> {
        const playlist = new Playlist(
            params.id,
            params.nombre,
            params.creadorId,
            params.contenido,
            params.esPublica,
            params.portadaUrl,
            params.descripcion
        );
        await this.playlistRepo.crear(playlist);
    }
}
