export interface MetadataPodcast {
  duracion: number; // en segundos
  bitrate: number; // kbps
  formato: string; // mp3, flac, etc.
  tamano: number; // en bytes
  fechaPublicacion: Date;
  descripcion: string;
  idioma: string;
  episodio?: number;
  temporada?: number;
}

export interface EstadisticasPodcast {
  reproducciones: number;
  meGusta: number;
  noMeGusta: number;
  compartidos: number;
  descargas: number;
  suscriptores: number;
  ultimaReproduccion?: Date;
}

export class Podcast {
  private readonly id: string;
  private titulo: string;
  private autorId: string;
  private generoId: string;
  private urlAudio: string;
  private urlImagen?: string;
  private metadata: MetadataPodcast;
  private estadisticas: EstadisticasPodcast;
  private activo: boolean;
  private fechaCreacion: Date;

  constructor(params: {
    id: string;
    titulo: string;
    autorId: string;
    generoId: string;
    urlAudio: string;
    urlImagen?: string;
    metadata: MetadataPodcast;
    estadisticas?: EstadisticasPodcast;
    activo?: boolean;
    fechaCreacion?: Date;
  }) {
    this.id = params.id;
    this.titulo = params.titulo;
    this.autorId = params.autorId;
    this.generoId = params.generoId;
    this.urlAudio = params.urlAudio;
    this.urlImagen = params.urlImagen;
    this.metadata = params.metadata;
    this.estadisticas = params.estadisticas || {
      reproducciones: 0,
      meGusta: 0,
      noMeGusta: 0,
      compartidos: 0,
      descargas: 0,
      suscriptores: 0
    };
    this.activo = params.activo ?? true;
    this.fechaCreacion = params.fechaCreacion || new Date();
  }

  // Getters
  getId(): string { return this.id; }
  getTitulo(): string { return this.titulo; }
  getAutorId(): string { return this.autorId; }
  getGeneroId(): string { return this.generoId; }
  getUrlAudio(): string { return this.urlAudio; }
  getUrlImagen(): string | undefined { return this.urlImagen; }
  getMetadata(): MetadataPodcast { return { ...this.metadata }; }
  getEstadisticas(): EstadisticasPodcast { return { ...this.estadisticas }; }
  isActivo(): boolean { return this.activo; }
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

  incrementarSuscriptor(): void {
    this.estadisticas.suscriptores++;
  }

  decrementarSuscriptor(): void {
    if (this.estadisticas.suscriptores > 0) {
      this.estadisticas.suscriptores--;
    }
  }

  activar(): void {
    this.activo = true;
  }

  desactivar(): void {
    this.activo = false;
  }

  actualizarMetadata(metadata: Partial<MetadataPodcast>): void {
    this.metadata = { ...this.metadata, ...metadata };
  }

  actualizarEstadisticas(estadisticas: Partial<EstadisticasPodcast>): void {
    this.estadisticas = { ...this.estadisticas, ...estadisticas };
  }

  getDuracionFormateada(): string {
    const minutos = Math.floor(this.metadata.duracion / 60);
    const segundos = this.metadata.duracion % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  }

  getTipoContenido(): string {
    return 'podcast';
  }

  getEpisodioCompleto(): string {
    if (this.metadata.temporada && this.metadata.episodio) {
      return `S${this.metadata.temporada}E${this.metadata.episodio}`;
    }
    return '';
  }
} 