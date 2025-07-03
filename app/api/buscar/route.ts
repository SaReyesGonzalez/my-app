import { NextResponse } from 'next/server';

// Datos de prueba para desarrollo
const contenidoPrueba = [
  {
    id: "1",
    titulo: "Bohemian Rhapsody",
    tipo: "cancion" as const,
    autor: "Queen",
    genero: "Rock",
    duracion: "5:55",
    urlImagen: "https://picsum.photos/300/300?random=1"
  },
  {
    id: "2",
    titulo: "Imagine",
    tipo: "cancion" as const,
    autor: "John Lennon",
    genero: "Rock",
    duracion: "3:03",
    urlImagen: "https://picsum.photos/300/300?random=2"
  },
  {
    id: "3",
    titulo: "Episodio 1: Introducción al Desarrollo Web",
    tipo: "podcast" as const,
    autor: "Tech Podcast",
    genero: "Tecnología",
    duracion: "45:30",
    urlImagen: "https://picsum.photos/300/300?random=3"
  },
  {
    id: "4",
    titulo: "Hotel California",
    tipo: "cancion" as const,
    autor: "Eagles",
    genero: "Rock",
    duracion: "6:30",
    urlImagen: "https://picsum.photos/300/300?random=4"
  },
  {
    id: "5",
    titulo: "Episodio 2: JavaScript Moderno",
    tipo: "podcast" as const,
    autor: "Code Masters",
    genero: "Programación",
    duracion: "52:15",
    urlImagen: "https://picsum.photos/300/300?random=5"
  },
  {
    id: "6",
    titulo: "Stairway to Heaven",
    tipo: "cancion" as const,
    autor: "Led Zeppelin",
    genero: "Rock",
    duracion: "8:02",
    urlImagen: "https://picsum.photos/300/300?random=6"
  },
  {
    id: "7",
    titulo: "Dynamite",
    tipo: "cancion" as const,
    autor: "BTS",
    genero: "K-pop",
    duracion: "3:19",
    urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
  },
  {
    id: "8",
    titulo: "How You Like That",
    tipo: "cancion" as const,
    autor: "BLACKPINK",
    genero: "K-pop",
    duracion: "3:01",
    urlImagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center"
  },
  {
    id: "9",
    titulo: "Fancy",
    tipo: "cancion" as const,
    autor: "TWICE",
    genero: "K-pop",
    duracion: "3:35",
    urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
  },
  {
    id: "10",
    titulo: "Episodio 3: React vs Vue",
    tipo: "podcast" as const,
    autor: "Frontend Masters",
    genero: "Programación",
    duracion: "48:20",
    urlImagen: "https://picsum.photos/300/300?random=10"
  },
  {
    id: "11",
    titulo: "Butter",
    tipo: "cancion" as const,
    autor: "BTS",
    genero: "K-pop",
    duracion: "2:42",
    urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
  },
  {
    id: "12",
    titulo: "Kill This Love",
    tipo: "cancion" as const,
    autor: "BLACKPINK",
    genero: "K-pop",
    duracion: "3:11",
    urlImagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center"
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(contenidoPrueba);
    }

    // Búsqueda simple por título, autor o género
    const resultados = contenidoPrueba.filter(item => 
      item.titulo.toLowerCase().includes(query.toLowerCase()) ||
      item.autor.toLowerCase().includes(query.toLowerCase()) ||
      item.genero.toLowerCase().includes(query.toLowerCase())
    );

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json(resultados);
  } catch (error) {
    console.error('Error en búsqueda:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 