import { Usuario } from "./Usuario";

export class Playlist extends ArrayMusica {
    private readonly creadorId: Usuario["id"];
    private readonly esPublica: boolean;
    private readonly descripcion?: String;
    private readonly portadaUrl?: string;

    constructor(params: {
        creador: string;
        esPublica: boolean;
        descripcion?: string;
        portadaUrl?: string;
    }) {
        super();
        this.creadorId = params.creador;
        this.esPublica = params.esPublica;
        this.descripcion = params.descripcion;
        this.portadaUrl = params.portadaUrl;
    }


}