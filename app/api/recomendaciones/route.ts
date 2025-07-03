import { NextResponse } from 'next/server';

// Datos de prueba para recomendaciones personalizadas
const recomendacionesPrueba = [
  {
    id: "13",
    titulo: "Spring Day",
    tipo: "cancion" as const,
    autor: "BTS",
    genero: "K-pop",
    duracion: "4:18",
    urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
  },
  {
    id: "14",
    titulo: "DDU-DU DDU-DU",
    tipo: "cancion" as const,
    autor: "BLACKPINK",
    genero: "K-pop",
    duracion: "3:31",
    urlImagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center"
  },
  {
    id: "15",
    titulo: "Feel Special",
    tipo: "cancion" as const,
    autor: "TWICE",
    genero: "K-pop",
    duracion: "3:26",
    urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
  },
  {
    id: "16",
    titulo: "Episodio 4: K-pop y Cultura Coreana",
    tipo: "podcast" as const,
    autor: "K-Culture Podcast",
    genero: "Cultura",
    duracion: "42:15",
    urlImagen: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center"
  },
  {
    id: "17",
    titulo: "Boy With Luv",
    tipo: "cancion" as const,
    autor: "BTS",
    genero: "K-pop",
    duracion: "3:19",
    urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
  },
  {
    id: "18",
    titulo: "As If It's Your Last",
    tipo: "cancion" as const,
    autor: "BLACKPINK",
    genero: "K-pop",
    duracion: "3:33",
    urlImagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center"
  }
];

export async function GET() {
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return NextResponse.json(recomendacionesPrueba);
  } catch (error) {
    console.error('Error obteniendo recomendaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 