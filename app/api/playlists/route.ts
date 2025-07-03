import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../auth';
import clientPromise from '../../../lib/mongodb';

// GET - Listar playlists del usuario
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const usuarioId = session.user.id;
    const client = await clientPromise;
    const db = client.db();
    const playlists = await db.collection('playlists').find({ usuarioId }).toArray();
    return NextResponse.json(playlists);
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear playlist
export async function POST(request: NextRequest) {
  if (request.headers.get('x-user-type') !== 'registrado') {
    return NextResponse.json({ error: 'Solo usuarios registrados pueden crear playlists' }, { status: 401 });
  }
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const usuarioId = session.user.id;
    const { nombre } = await request.json();
    if (!nombre) {
      return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const nueva = { usuarioId, nombre, canciones: [] };
    const result = await db.collection('playlists').insertOne(nueva);
    return NextResponse.json({ ...nueva, _id: result.insertedId });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar playlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const usuarioId = session.user.id;
    const { playlistId } = await request.json();
    if (!playlistId) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    await db.collection('playlists').deleteOne({ _id: playlistId, usuarioId });
    return NextResponse.json({ message: 'Playlist eliminada' });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Modificar playlist (nombre o canciones)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const usuarioId = session.user.id;
    const { playlistId, nombre, canciones } = await request.json();
    if (!playlistId) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const update: { nombre?: string; canciones?: string[] } = {};
    if (nombre) update.nombre = nombre;
    if (canciones) update.canciones = canciones;
    await db.collection('playlists').updateOne({ _id: playlistId, usuarioId }, { $set: update });
    return NextResponse.json({ message: 'Playlist actualizada' });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 