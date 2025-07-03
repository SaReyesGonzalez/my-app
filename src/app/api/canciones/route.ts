import { NextResponse } from 'next/server';
import { CancionRepositoryMongo } from '@/infrastructure/repositories/CancionRepositoryMongo';
import { CancionRepositoryNeo4j } from '@/infrastructure/repositories/CancionRepositoryNeo4j';
import { Cancion } from '@/entities/models/Cancion';
import { Autor } from '@/entities/models/Autor';
import { Genero } from '@/entities/models/Genero';

const cancionRepoMongo = new CancionRepositoryMongo();
const cancionRepoNeo4j = new CancionRepositoryNeo4j();

export async function POST(request: Request) {
  try {
    const {
      titulo,
      duracion,
      autorId,
      generoId,
      fechaLanzamiento,
      albumId,
      letra,
      urlAudio,
      urlPortada
    } = await request.json();

    // Validaciones básicas
    if (!titulo || !duracion || !autorId || !generoId || !urlAudio) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: titulo, duracion, autorId, generoId, urlAudio' },
        { status: 400 }
      );
    }

    // Crear canción en MongoDB
    const cancionId = await cancionRepoMongo.crear({
      titulo,
      duracion,
      autorId,
      generoId,
      fechaLanzamiento: new Date(fechaLanzamiento),
      albumId,
      letra,
      urlAudio,
      urlPortada
    });

    // Crear relaciones en Neo4j
    const cancion = new Cancion({
      id: cancionId,
      titulo,
      duracion,
      autorId,
      generoId,
      fechaLanzamiento: new Date(fechaLanzamiento)
    });

    const autor = new Autor({
      id: autorId,
      nombre: 'Autor', // Esto debería venir de la base de datos
      biografia: ''
    });

    const genero = new Genero({
      id: generoId,
      nombre: 'Género', // Esto debería venir de la base de datos
      descripcion: ''
    });

    await cancionRepoNeo4j.crearCancion(cancion, autor, genero);

    return NextResponse.json({
      message: 'Canción creada exitosamente',
      cancionId
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error al crear canción:', error);
    return NextResponse.json(
      { error: 'Error al crear canción' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const titulo = searchParams.get('titulo');
    const autorId = searchParams.get('autorId');
    const generoId = searchParams.get('generoId');
    const limite = parseInt(searchParams.get('limite') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let canciones;

    if (id) {
      const cancion = await cancionRepoMongo.buscarPorId(id);
      if (!cancion) {
        return NextResponse.json(
          { error: 'Canción no encontrada' },
          { status: 404 }
        );
      }
      return NextResponse.json({ cancion });
    }

    if (titulo) {
      canciones = await cancionRepoMongo.buscarPorTitulo(titulo);
    } else if (autorId) {
      canciones = await cancionRepoMongo.buscarPorAutor(autorId);
    } else if (generoId) {
      canciones = await cancionRepoMongo.buscarPorGenero(generoId);
    } else {
      canciones = await cancionRepoMongo.obtenerTodas(limite, offset);
    }

    return NextResponse.json({
      canciones: canciones.map(c => ({
        id: c._id?.toString(),
        titulo: c.titulo,
        duracion: c.duracion,
        autorId: c.autorId,
        generoId: c.generoId,
        fechaLanzamiento: c.fechaLanzamiento,
        albumId: c.albumId,
        letra: c.letra,
        urlPortada: c.urlPortada,
        reproducciones: c.reproducciones,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
      }))
    });

  } catch (error: any) {
    console.error('Error al buscar canciones:', error);
    return NextResponse.json(
      { error: 'Error al buscar canciones' },
      { status: 500 }
    );
  }
} 