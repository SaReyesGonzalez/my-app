import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../auth';
import clientPromise from '../../../lib/mongodb';

// GET - Obtener favoritos del usuario
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    const usuarioId = session.user.id;
    const client = await clientPromise;
    const db = client.db();
    const favoritos = await db.collection('favoritos').find({ usuarioId }).toArray();
    const contenidoIds = favoritos.map(fav => fav.contenidoId);
    const canciones = await db.collection('canciones').find({ id: { $in: contenidoIds } }).toArray();
    const podcasts = await db.collection('podcasts').find({ id: { $in: contenidoIds } }).toArray();
    const contenidos = [...canciones, ...podcasts];
    // Mapear favoritos a los datos completos del contenido
    const favoritosCompletos = favoritos.map(fav => {
      const contenido = contenidos.find(c => c.id === fav.contenidoId) || {};
      return {
        ...contenido,
        id: fav.contenidoId,
      };
    });
    return NextResponse.json(favoritosCompletos);
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Agregar favorito
export async function POST(request: NextRequest) {
  if (request.headers.get('x-user-type') !== 'registrado') {
    return new Response('Solo usuarios registrados pueden gestionar favoritos', { status: 401 });
  }
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { contenido } = await request.json();
    if (!contenido || !contenido.id) {
      return NextResponse.json({ error: 'Contenido requerido' }, { status: 400 });
    }

    const usuarioId = session.user.id;
    const client = await clientPromise;
    const db = client.db();
    // Evitar duplicados
    const existe = await db.collection('favoritos').findOne({ usuarioId, contenidoId: contenido.id });
    if (!existe) {
      await db.collection('favoritos').insertOne({ usuarioId, contenidoId: contenido.id });
    }
    return NextResponse.json({ 
      message: 'Favorito agregado exitosamente',
      contenidoId: contenido.id
    });
  } catch (error) {
    console.error('Error agregando favorito:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Quitar favorito
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { contenidoId } = await request.json();
    
    if (!contenidoId) {
      return NextResponse.json({ error: 'ID de contenido requerido' }, { status: 400 });
    }

    const usuarioId = session.user.id;
    const client = await clientPromise;
    const db = client.db();
    await db.collection('favoritos').deleteOne({ usuarioId, contenidoId });
    return NextResponse.json({ 
      message: 'Favorito quitado exitosamente',
      contenidoId 
    });
  } catch (error) {
    console.error('Error quitando favorito:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 