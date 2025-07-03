import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../auth';

// Datos de prueba para favoritos
const favoritosDemo = [
  {
    id: '7',
    titulo: 'Dynamite',
    tipo: 'cancion' as const,
    autor: 'BTS',
    genero: 'K-pop',
    duracion: '3:19',
    urlImagen: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center'
  },
  {
    id: '8',
    titulo: 'How You Like That',
    tipo: 'cancion' as const,
    autor: 'BLACKPINK',
    genero: 'K-pop',
    duracion: '3:01',
    urlImagen: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center'
  },
  {
    id: '13',
    titulo: 'Spring Day',
    tipo: 'cancion' as const,
    autor: 'BTS',
    genero: 'K-pop',
    duracion: '4:18',
    urlImagen: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center'
  }
];

// GET - Obtener favoritos del usuario
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Por ahora retornamos datos de prueba
    // En una implementación real, consultarías la base de datos
    return NextResponse.json(favoritosDemo);
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Agregar favorito
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { contenidoId } = await request.json();
    
    if (!contenidoId) {
      return NextResponse.json({ error: 'ID de contenido requerido' }, { status: 400 });
    }

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));

    console.log(`Favorito agregado para contenido: ${contenidoId}`);
    
    return NextResponse.json({ 
      message: 'Favorito agregado exitosamente',
      contenidoId 
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

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));

    console.log(`Favorito quitado para contenido: ${contenidoId}`);
    
    return NextResponse.json({ 
      message: 'Favorito quitado exitosamente',
      contenidoId 
    });
  } catch (error) {
    console.error('Error quitando favorito:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 