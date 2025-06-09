import { Media } from "./Media";
import { Usuario } from "./Usuario";

export interface EntradaHistorial {
    contenidoId: Media;      // ID del contenido reproducido
    titulo: string;          // Nombre del contenido para mostrar rápido
    fechaReproduccion: Date;  // Cuándo se reprodujo
    progreso?: number;        // Progreso en segundos (opcional, útil para continuar viendo Podcasts)
}

export class HistorialReproduccion {
    private usuarioId: Usuario;
    private entradas: EntradaHistorial[];

    constructor(params: { usuarioId: Usuario; entradas?: EntradaHistorial[] }) {
        this.usuarioId = params.usuarioId;
        this.entradas = params.entradas ?? [];
    }

    getUsuarioId(): string {
        return this.usuarioId;
    }

    getEntradas(): EntradaHistorial[] {
        // Retorna una copia para evitar modificaciones externas
        return [...this.entradas];
    }

    agregarEntrada(entrada: EntradaHistorial) {
        this.entradas.push(entrada);
    }

    obtenerUltimaEntrada(): EntradaHistorial | undefined {
        if (this.entradas.length === 0) return undefined;
        // Suponiendo que las entradas están ordenadas por fecha de reproducción
        return this.entradas[this.entradas.length - 1];
    }

    limpiarHistorial() {
        this.entradas = [];
    }

    // (Opcional) Obtener historial filtrado por tipo de contenido
    filtrarPorTipo(tipo: EntradaHistorial["tipoContenido"]): EntradaHistorial[] {
        return this.entradas.filter(e => e.tipoContenido === tipo);
    }

    // (Opcional) Obtener historial de los últimos N elementos
    ultimos(n: number): EntradaHistorial[] {
        return this.entradas.slice(-n);
    }
}