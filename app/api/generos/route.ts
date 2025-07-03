import { NextResponse } from 'next/server';

// Géneros de música disponibles en la aplicación
const generosMusica = [
  { id: 'Rock', nombre: 'Rock', icono: '🤘', color: 'bg-red-500' },
  { id: 'K-pop', nombre: 'K-Pop', icono: '🌟', color: 'bg-purple-500' },
  { id: 'Pop', nombre: 'Pop', icono: '🎵', color: 'bg-pink-500' },
  { id: 'Hip Hop', nombre: 'Hip Hop', icono: '🎤', color: 'bg-orange-500' },
  { id: 'Electrónica', nombre: 'Electrónica', icono: '🎧', color: 'bg-blue-500' },
  { id: 'Jazz', nombre: 'Jazz', icono: '🎷', color: 'bg-yellow-500' },
  { id: 'Clásica', nombre: 'Clásica', icono: '🎻', color: 'bg-green-500' },
  { id: 'Reggaeton', nombre: 'Reggaeton', icono: '🔥', color: 'bg-indigo-500' }
];

// Géneros de podcasts disponibles
const generosPodcasts = [
  { id: 'Tecnología', nombre: 'Tecnología', icono: '💻', color: 'bg-blue-500' },
  { id: 'Programación', nombre: 'Programación', icono: '👨‍💻', color: 'bg-green-500' },
  { id: 'Cultura', nombre: 'Cultura', icono: '🌍', color: 'bg-yellow-500' }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo'); // 'musica' o 'podcasts'
    
    if (tipo === 'podcasts') {
      return NextResponse.json(generosPodcasts);
    } else {
      return NextResponse.json(generosMusica);
    }
  } catch (error) {
    console.error('Error obteniendo géneros:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

 