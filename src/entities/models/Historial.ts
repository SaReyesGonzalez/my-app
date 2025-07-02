/**
 * Entrada individual del historial de reproducción.
 */
export interface EntradaHistorial {
    contenidoId: string;      // ID del contenido reproducido
    titulo: string;           // Nombre del contenido para mostrar rápido
    fechaReproduccion: Date;  // Cuándo se reprodujo
    progreso?: number;        // Progreso en segundos (opcional)
    tipoContenido?: string;   // Tipo de contenido (opcional, para filtrado)
}

/**
 * Historial de reproducción de un usuario o autor.
 */
export class HistorialReproduccion {
    private autorId: string;
    private entradas: EntradaHistorial[];

    constructor(params: { autorId: string; entradas?: EntradaHistorial[] }) {
        this.autorId = params.autorId;
        this.entradas = params.entradas ?? [];
    }

    getAutorId(): string {
        return this.autorId;
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
        return this.entradas[this.entradas.length - 1];
    }

    limpiarHistorial() {
        this.entradas = [];
    }

    /**
     * Filtra el historial por tipo de contenido.
     */
    filtrarPorTipo(tipo: string): EntradaHistorial[] {
        return this.entradas.filter(e => e.tipoContenido === tipo);
    }

    /**
     * Obtiene los últimos N elementos del historial.
     */
    ultimos(n: number): EntradaHistorial[] {
        return this.entradas.slice(-n);
    }

    /**
     * Busca entradas por fecha exacta.
     */
    buscarPorFecha(fecha: Date): EntradaHistorial[] {
        return this.entradas.filter(e => e.fechaReproduccion.toDateString() === fecha.toDateString());
    }

    /**
     * Filtra entradas por coincidencia en el título.
     */
    filtrarPorTitulo(texto: string): EntradaHistorial[] {
        return this.entradas.filter(e => e.titulo.toLowerCase().includes(texto.toLowerCase()));
    }
}

/**
 * Error personalizado para historial.
 */
export class HistorialError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "HistorialError";
    }
}