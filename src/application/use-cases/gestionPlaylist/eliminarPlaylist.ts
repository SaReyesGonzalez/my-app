import { PlaylistRepository } from "../../repositories/PlaylistRepository";

export class EliminarPlaylist {
    constructor(private playlistRepo: PlaylistRepository) { }

    async execute(params: { id: string }): Promise<void> {
        await this.playlistRepo.eliminar(params.id);
    }
}
