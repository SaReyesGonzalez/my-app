import { Playlist } from "../../entities/models/Playlist";

export interface PlaylistRepository {
    crear(playlist: Playlist): Promise<void>;
    actualizar(playlist: Playlist): Promise<void>;
    eliminar(id: string): Promise<void>;
    buscarPorId(id: string): Promise<Playlist | null>;
    buscarPorCreador(creadorId: string): Promise<Playlist[]>;
}
