import { PlaylistRepository } from "../../application/repositories/PlaylistRepository";
import { Playlist } from "../../entities/models/Playlist";

export class PlaylistRepositoryMemoria implements PlaylistRepository {
    private playlists: Playlist[] = [];

    constructor(playlistsIniciales: Playlist[] = []) {
        this.playlists = playlistsIniciales;
    }

    async crear(playlist: Playlist): Promise<void> {
        this.playlists.push(playlist);
    }

    async actualizar(playlist: Playlist): Promise<void> {
        const idx = this.playlists.findIndex(p => p.getId() === playlist.getId());
        if (idx !== -1) {
            this.playlists[idx] = playlist;
        }
    }

    async eliminar(id: string): Promise<void> {
        this.playlists = this.playlists.filter(p => p.getId() !== id);
    }

    async buscarPorId(id: string): Promise<Playlist | null> {
        return this.playlists.find(p => p.getId() === id) || null;
    }

    async buscarPorCreador(creadorId: string): Promise<Playlist[]> {
        return this.playlists.filter(p => p.getCreadorId() === creadorId);
    }

    // Método auxiliar para agregar playlist en pruebas
    agregarPlaylist(playlist: Playlist): void {
        this.playlists.push(playlist);
    }
} 