// Temporalmente comentado para evitar errores de TypeScript
// Este archivo será usado cuando se implemente la arquitectura completa

/*
import { Collection, ObjectId, Document } from 'mongodb';
import { Usuario, HistorialUsuario } from '../../entities/models/Usuario';
import { UsuarioRepository } from '../../application/repositories/UsuarioRepository';
import clientPromise from '../../../lib/mongodb';

interface UsuarioDocument extends Document {
  _id: ObjectId;
  rol: string;
  nombre: string;
  email: string;
  contraseñaHash: string;
  fechaRegistro: Date;
  preferencias: any;
  favoritos: string[];
  playlists: string[];
  historial: HistorialUsuario[];
  ultimaActividad?: Date;
}

export class UsuarioRepositoryMongo implements UsuarioRepository {
  private collection!: Collection;

  constructor() {
    this.initializeCollection();
  }

  private async initializeCollection() {
    const client = await clientPromise;
    const db = client.db();
    this.collection = db.collection('usuarios');
  }

  async crear(usuario: Usuario): Promise<void> {
    await this.initializeCollection();
    
    const usuarioDoc = {
      _id: new ObjectId(usuario.getId()),
      rol: usuario.getRol(),
      nombre: usuario.getNombre(),
      email: usuario.getEmail(),
      contraseñaHash: usuario.getContraseñaHash(),
      fechaRegistro: usuario.getFechaRegistro(),
      preferencias: usuario.getPreferencias(),
      favoritos: usuario.getFavoritos(),
      playlists: usuario.getPlaylists(),
      historial: usuario.getHistorial().map(h => ({
        ...h,
        fechaReproduccion: h.fechaReproduccion
      })),
      ultimaActividad: usuario.getUltimaActividad()
    };

    await this.collection.insertOne(usuarioDoc);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    await this.initializeCollection();
    
    const doc = await this.collection.findOne({ email });
    if (!doc) return null;

    return this.documentToUsuario(doc);
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    await this.initializeCollection();
    
    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;

    return this.documentToUsuario(doc);
  }

  async actualizar(usuario: Usuario): Promise<void> {
    await this.initializeCollection();
    
    const updateDoc = {
      rol: usuario.getRol(),
      nombre: usuario.getNombre(),
      email: usuario.getEmail(),
      contraseñaHash: usuario.getContraseñaHash(),
      fechaRegistro: usuario.getFechaRegistro(),
      preferencias: usuario.getPreferencias(),
      favoritos: usuario.getFavoritos(),
      playlists: usuario.getPlaylists(),
      historial: usuario.getHistorial().map(h => ({
        ...h,
        fechaReproduccion: h.fechaReproduccion
      })),
      ultimaActividad: usuario.getUltimaActividad()
    };

    await this.collection.updateOne(
      { _id: new ObjectId(usuario.getId()) },
      { $set: updateDoc }
    );
  }

  async agregarAlHistorial(usuarioId: string, historial: HistorialUsuario): Promise<void> {
    await this.initializeCollection();
    
    await this.collection.updateOne(
      { _id: new ObjectId(usuarioId) },
      { 
        $push: { 
          historial: {
            contenidoId: historial.contenidoId,
            tipo: historial.tipo,
            duracionReproducida: historial.duracionReproducida,
            fechaReproduccion: historial.fechaReproduccion
          }
        },
        $set: { ultimaActividad: new Date() }
      }
    );
  }

  async agregarFavorito(usuarioId: string, contenidoId: string): Promise<void> {
    await this.initializeCollection();
    
    await this.collection.updateOne(
      { _id: new ObjectId(usuarioId) },
      { $addToSet: { favoritos: contenidoId } }
    );
  }

  async removerFavorito(usuarioId: string, contenidoId: string): Promise<void> {
    await this.initializeCollection();
    
    await this.collection.updateOne(
      { _id: new ObjectId(usuarioId) },
      { $pull: { favoritos: contenidoId } }
    );
  }

  async agregarPlaylist(usuarioId: string, playlistId: string): Promise<void> {
    await this.initializeCollection();
    
    await this.collection.updateOne(
      { _id: new ObjectId(usuarioId) },
      { $addToSet: { playlists: playlistId } }
    );
  }

  private documentToUsuario(doc: any): Usuario {
    return new Usuario({
      id: doc._id.toString(),
      rol: doc.rol,
      nombre: doc.nombre,
      email: doc.email,
      contraseñaHash: doc.contraseñaHash,
      fechaRegistro: doc.fechaRegistro,
      preferencias: doc.preferencias,
      favoritos: doc.favoritos || [],
      playlists: doc.playlists || [],
      historial: (doc.historial || []).map((h: any) => ({
        ...h,
        fechaReproduccion: new Date(h.fechaReproduccion)
      })),
      ultimaActividad: doc.ultimaActividad ? new Date(doc.ultimaActividad) : undefined
    });
  }
}
*/ 