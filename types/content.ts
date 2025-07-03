export interface Contenido {
  id: string;
  titulo: string;
  tipo: 'cancion' | 'podcast';
  autor: string;
  genero: string;
  duracion: string;
  urlImagen: string;
  urlAudio?: string;
}

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  favoritos: string[];
  historial: string[];
}

export interface Favorito {
  id: string;
  usuarioId: string;
  contenidoId: string;
  fechaAgregado: Date;
}

export interface HistorialReproduccion {
  id: string;
  usuarioId: string;
  contenidoId: string;
  fechaReproduccion: Date;
}

export interface Recomendacion {
  id: string;
  usuarioId: string;
  contenidoId: string;
  puntuacion: number;
  fechaGenerada: Date;
} 