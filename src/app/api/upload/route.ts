import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { CancionRepositoryMongo } from '@/infrastructure/repositories/CancionRepositoryMongo';
import { CancionRepositoryNeo4j } from '@/infrastructure/repositories/CancionRepositoryNeo4j';
import { Cancion } from '@/entities/models/Cancion';
import { Autor } from '@/entities/models/Autor';
import { Genero } from '@/entities/models/Genero';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const titulo = formData.get('titulo') as string;
    const autorId = formData.get('autorId') as string;
    const generoId = formData.get('generoId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo se permiten archivos de audio.' },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 50MB.' },
        { status: 400 }
      );
    }

    // Crear directorio si no existe
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = join(uploadDir, fileName);

    // Convertir File a Buffer y guardar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // URL pública del archivo
    const publicUrl = `/uploads/${fileName}`;

    // Crear la canción en la base de datos
    try {
      const cancionRepoMongo = new CancionRepositoryMongo();
      const cancionRepoNeo4j = new CancionRepositoryNeo4j();

      // Crear en MongoDB
      const cancionId = await cancionRepoMongo.crear({
        titulo,
        duracion: 0, // Se puede calcular después
        autorId,
        generoId,
        fechaLanzamiento: new Date(),
        urlAudio: publicUrl,
        urlPortada: `https://picsum.photos/300/300?random=${Date.now()}`
      });

      // Crear relaciones en Neo4j
      const cancion = new Cancion({
        id: cancionId,
        titulo,
        duracion: 0,
        autorId,
        generoId,
        fechaLanzamiento: new Date()
      });

      const autor = new Autor({
        id: autorId,
        nombre: autorId,
        biografia: ''
      });

      const genero = new Genero({
        id: generoId,
        nombre: generoId,
        descripcion: ''
      });

      await cancionRepoNeo4j.crearCancion(cancion, autor, genero);

      return NextResponse.json({
        message: 'Canción subida y creada exitosamente',
        fileName,
        publicUrl,
        cancionId,
        size: file.size,
        type: file.type
      });

    } catch (dbError) {
      console.error('Error al crear canción en BD:', dbError);
      return NextResponse.json({
        message: 'Archivo subido pero error al crear en base de datos',
        fileName,
        publicUrl,
        size: file.size,
        type: file.type,
        error: 'Error en base de datos'
      });
    }

  } catch (error: any) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json(
      { error: 'Error al subir el archivo' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint para subir archivos de audio',
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg'],
    maxSize: '50MB'
  });
} 