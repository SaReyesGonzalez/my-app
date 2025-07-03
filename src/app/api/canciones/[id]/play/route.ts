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
    const cancionId = params.id;
    // Aquí deberías obtener el usuario de la sesión si es necesario
    await cancionRepoMongo.incrementarReproducciones(cancionId);
    return NextResponse.json({ message: 'Reproducción registrada' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar reproducción' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cancionId = params.id;
    const cancion = await cancionRepoMongo.buscarPorId(cancionId);
    if (!cancion) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    return NextResponse.json({ cancion });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener canción' }, { status: 500 });
  }
} 