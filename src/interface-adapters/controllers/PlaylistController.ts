import { CrearPlaylist } from "../../application/use-cases/gestionPlaylist/crearPlaylist";
import { ModificarPlaylist } from "../../application/use-cases/gestionPlaylist/modificarPlaylist";
import { EliminarPlaylist } from "../../application/use-cases/gestionPlaylist/eliminarPlaylist";
import { PlaylistRepository } from "../../application/repositories/PlaylistRepository";

export class PlaylistController {
    constructor(private playlistRepo: PlaylistRepository) { }

    async crearPlaylist(params: any) {
        const useCase = new CrearPlaylist(this.playlistRepo);
        return await useCase.execute(params);
    }

    async modificarPlaylist(params: any) {
        const useCase = new ModificarPlaylist(this.playlistRepo);
        return await useCase.execute(params);
    }

    async eliminarPlaylist(params: { id: string }) {
        const useCase = new EliminarPlaylist(this.playlistRepo);
        return await useCase.execute(params);
    }
}
