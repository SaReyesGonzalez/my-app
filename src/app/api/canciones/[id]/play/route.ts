import { NextResponse } from 'next/server';
import { CancionRepositoryMongo } from '@/infrastructure/repositories/CancionRepositoryMongo';
import { CancionRepositoryNeo4j } from '@/infrastructure/repositories/CancionRepositoryNeo4j';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

const cancionRepoMongo = new CancionRepositoryMongo();
const cancionRepoNeo4j = new CancionRepositoryNeo4j();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Por ahora, usar un usuario temporal para pruebas
    // En producción, esto debería venir de la sesión autenticada
    const usuarioId = 'usuario-temp@test.com';
    const cancionId = params.id;

    // Verificar que la canción existe
    const cancion = await cancionRepoMongo.buscarPorId(cancionId);
    if (!cancion) {
      return NextResponse.json(
        { error: 'Canción no encontrada' },
        { status: 404 }
      );
    }

    // Incrementar reproducciones en MongoDB
    await cancionRepoMongo.incrementarReproducciones(cancionId);

    // Registrar reproducción en Neo4j para recomendaciones
    await cancionRepoNeo4j.registrarReproduccion(usuarioId, cancionId);

    return NextResponse.json({
      message: 'Reproducción registrada exitosamente',
      cancion: {
        id: cancion._id?.toString(),
        titulo: cancion.titulo,
        duracion: cancion.duracion,
        urlAudio: cancion.urlAudio,
        urlPortada: cancion.urlPortada,
        reproducciones: cancion.reproducciones + 1
      }
    });

  } catch (error: any) {
    console.error('Error al reproducir canción:', error);
    return NextResponse.json(
      { error: 'Error al reproducir canción' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cancionId = params.id;

    // Obtener información de la canción
    const cancion = await cancionRepoMongo.buscarPorId(cancionId);
    if (!cancion) {
      return NextResponse.json(
        { error: 'Canción no encontrada' },
        { status: 404 }
      );
    }

    // Obtener canciones similares desde Neo4j
    const cancionesSimilares = await cancionRepoNeo4j.obtenerCancionesSimilares(cancionId, 5);

    return NextResponse.json({
      cancion: {
        id: cancion._id?.toString(),
        titulo: cancion.titulo,
        duracion: cancion.duracion,
        autorId: cancion.autorId,
        generoId: cancion.generoId,
        fechaLanzamiento: cancion.fechaLanzamiento,
        albumId: cancion.albumId,
        letra: cancion.letra,
        urlAudio: cancion.urlAudio,
        urlPortada: cancion.urlPortada,
        reproducciones: cancion.reproducciones,
        createdAt: cancion.createdAt,
        updatedAt: cancion.updatedAt
      },
      cancionesSimilares: cancionesSimilares.map(c => ({
        id: c.getId(),
        titulo: c.getTitulo(),
        duracion: c.getDuracion()
      }))
    });

  } catch (error: any) {
    console.error('Error al obtener información de canción:', error);
    return NextResponse.json(
      { error: 'Error al obtener información de canción' },
      { status: 500 }
    );
  }
} 