import { ObjectId } from 'mongodb';

export interface CancionMongo {
  _id?: ObjectId;
  titulo: string;
  duracion: number; // en segundos
  autorId: string;
  generoId: string;
  fechaLanzamiento: Date;
  albumId?: string;
  letra?: string;
  urlAudio: string; // URL del archivo de audio
  urlPortada?: string; // URL de la imagen de portada
  reproducciones: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CancionSinAudio extends Omit<CancionMongo, 'urlAudio'> {
  urlAudio?: never;
}

export interface CancionParaCrear {
  titulo: string;
  duracion: number;
  autorId: string;
  generoId: string;
  fechaLanzamiento: Date;
  albumId?: string;
  letra?: string;
  urlAudio: string;
  urlPortada?: string;
} 