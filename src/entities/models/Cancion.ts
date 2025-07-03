

/**
 * Entidad Cancion, hereda de Media.
 */
export interface MetadataCancion {
  duracion: number; // en segundos
  bitrate: number; // kbps
  formato: string; // mp3, flac, etc.
  tamano: number; // en bytes
  fechaLanzamiento: Date;
  letra?: string;
  idioma: string;
}

export interface EstadisticasCancion {
  reproducciones: number;
  meGusta: number;
  noMeGusta: number;
  compartidos: number;
  descargas: number;
  ultimaReproduccion?: Date;
}

export class Cancion {
  private readonly id: string;
  private titulo: string;
  private autorId: string;
  private albumId?: string;
  private generoId: string;
  private urlAudio: string;
  private urlImagen?: string;
  private metadata: MetadataCancion;
  private estadisticas: EstadisticasCancion;
  private activa: boolean;
  private fechaCreacion: Date;

  constructor(params: {
    id: string;
    titulo: string;
    autorId: string;
    albumId?: string;
    generoId: string;
    urlAudio: string;
    urlImagen?: string;
    metadata: MetadataCancion;
    estadisticas?: EstadisticasCancion;
    activa?: boolean;
    fechaCreacion?: Date;
  }) {
    this.id = params.id;
    this.titulo = params.titulo;
    this.autorId = params.autorId;
    this.albumId = params.albumId;
    this.generoId = params.generoId;
    this.urlAudio = params.urlAudio;
    this.urlImagen = params.urlImagen;
    this.metadata = params.metadata;
    this.estadisticas = params.estadisticas || {
      reproducciones: 0,
      meGusta: 0,
      noMeGusta: 0,
      compartidos: 0,
      descargas: 0
    };
    this.activa = params.activa ?? true;
    this.fechaCreacion = params.fechaCreacion || new Date();
  }

  // Getters
  getId(): string { return this.id; }
  getTitulo(): string { return this.titulo; }
  getAutorId(): string { return this.autorId; }
  getAlbumId(): string | undefined { return this.albumId; }
  getGeneroId(): string { return this.generoId; }
  getUrlAudio(): string { return this.urlAudio; }
  getUrlImagen(): string | undefined { return this.urlImagen; }
  getMetadata(): MetadataCancion { return { ...this.metadata }; }
  getEstadisticas(): EstadisticasCancion { return { ...this.estadisticas }; }
  isActiva(): boolean { return this.activa; }
  getFechaCreacion(): Date { return this.fechaCreacion; }

  // Métodos de negocio
  incrementarReproduccion(): void {
    this.estadisticas.reproducciones++;
    this.estadisticas.ultimaReproduccion = new Date();
  }

  incrementarMeGusta(): void {
    this.estadisticas.meGusta++;
  }

  decrementarMeGusta(): void {
    if (this.estadisticas.meGusta > 0) {
      this.estadisticas.meGusta--;
    }
  }

  incrementarNoMeGusta(): void {
    this.estadisticas.noMeGusta++;
  }

  incrementarCompartido(): void {
    this.estadisticas.compartidos++;
  }

  incrementarDescarga(): void {
    this.estadisticas.descargas++;
  }

  activar(): void {
    this.activa = true;
  }

  desactivar(): void {
    this.activa = false;
  }

  actualizarMetadata(metadata: Partial<MetadataCancion>): void {
    this.metadata = { ...this.metadata, ...metadata };
  }

  actualizarEstadisticas(estadisticas: Partial<EstadisticasCancion>): void {
    this.estadisticas = { ...this.estadisticas, ...estadisticas };
  }

  getDuracionFormateada(): string {
    const minutos = Math.floor(this.metadata.duracion / 60);
    const segundos = this.metadata.duracion % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  }

  getTipoContenido(): string {
    return 'cancion';
  }

  reproducir(): void {
    // Lógica para reproducir la canción
    // Por ejemplo: console.log(`Reproduciendo canción: ${this.titulo}`);
  }
}