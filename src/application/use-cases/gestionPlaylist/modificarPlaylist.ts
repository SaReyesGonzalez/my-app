import { PlaylistRepository } from "../../repositories/PlaylistRepository";
import { Playlist } from "../../../entities/models/Playlist";

export class ModificarPlaylist {
    constructor(private playlistRepo: PlaylistRepository) { }

    async execute(params: {
        id: string;
        nombre?: string;
        contenido?: any[];
        esPublica?: boolean;
        portadaUrl?: string;
        descripcion?: string;
    }): Promise<void> {
        const playlist = await this.playlistRepo.buscarPorId(params.id);
        if (!playlist) throw new Error("Playlist no encontrada");

        if (params.nombre) playlist.setNombre(params.nombre);
        if (params.contenido) playlist.setContenido(params.contenido);
        if (params.esPublica !== undefined) playlist.setPublica(params.esPublica);
        if (params.portadaUrl) playlist.setPortada(params.portadaUrl);
        if (params.descripcion) playlist.setDescripcion(params.descripcion);

        await this.playlistRepo.actualizar(playlist);
    }
}
