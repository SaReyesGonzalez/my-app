import { NextResponse } from 'next/server';
import redis from '../../../lib/redis';

// Datos de prueba para rankings con contadores de reproducciones
const rankingsData = {
  global: [
    {
      id: "7",
      titulo: "Dynamite",
      autor: "BTS",
      genero: "K-pop",
      reproducciones: 15420,
      posicion: 1,
      urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
    },
    {
      id: "8",
      titulo: "How You Like That",
      autor: "BLACKPINK",
      genero: "K-pop",
      reproducciones: 12850,
      posicion: 2,
      urlImagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center"
    },
    {
      id: "1",
      titulo: "Bohemian Rhapsody",
      autor: "Queen",
      genero: "Rock",
      reproducciones: 11560,
      posicion: 3,
      urlImagen: "https://picsum.photos/300/300?random=1"
    },
    {
      id: "11",
      titulo: "Butter",
      autor: "BTS",
      genero: "K-pop",
      reproducciones: 10230,
      posicion: 4,
      urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
    },
    {
      id: "2",
      titulo: "Imagine",
      autor: "John Lennon",
      genero: "Rock",
      reproducciones: 9870,
      posicion: 5,
      urlImagen: "https://picsum.photos/300/300?random=2"
    },
    {
      id: "12",
      titulo: "Kill This Love",
      autor: "BLACKPINK",
      genero: "K-pop",
      reproducciones: 8950,
      posicion: 6,
      urlImagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center"
    },
    {
      id: "9",
      titulo: "Fancy",
      autor: "TWICE",
      genero: "K-pop",
      reproducciones: 8230,
      posicion: 7,
      urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
    },
    {
      id: "4",
      titulo: "Hotel California",
      autor: "Eagles",
      genero: "Rock",
      reproducciones: 7650,
      posicion: 8,
      urlImagen: "https://picsum.photos/300/300?random=4"
    },
    {
      id: "6",
      titulo: "Stairway to Heaven",
      autor: "Led Zeppelin",
      genero: "Rock",
      reproducciones: 7120,
      posicion: 9,
      urlImagen: "https://picsum.photos/300/300?random=6"
    },
    {
      id: "13",
      titulo: "Spring Day",
      autor: "BTS",
      genero: "K-pop",
      reproducciones: 6890,
      posicion: 10,
      urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
    }
  ],
  kpop: [
    {
      id: "7",
      titulo: "Dynamite",
      autor: "BTS",
      genero: "K-pop",
      reproducciones: 15420,
      posicion: 1,
      urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
    },
    {
      id: "8",
      titulo: "How You Like That",
      autor: "BLACKPINK",
      genero: "K-pop",
      reproducciones: 12850,
      posicion: 2,
      urlImagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center"
    },
    {
      id: "11",
      titulo: "Butter",
      autor: "BTS",
      genero: "K-pop",
      reproducciones: 10230,
      posicion: 3,
      urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
    },
    {
      id: "12",
      titulo: "Kill This Love",
      autor: "BLACKPINK",
      genero: "K-pop",
      reproducciones: 8950,
      posicion: 4,
      urlImagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center"
    },
    {
      id: "9",
      titulo: "Fancy",
      autor: "TWICE",
      genero: "K-pop",
      reproducciones: 8230,
      posicion: 5,
      urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
    }
  ],
  rock: [
    {
      id: "1",
      titulo: "Bohemian Rhapsody",
      autor: "Queen",
      genero: "Rock",
      reproducciones: 11560,
      posicion: 1,
      urlImagen: "https://picsum.photos/300/300?random=1"
    },
    {
      id: "2",
      titulo: "Imagine",
      autor: "John Lennon",
      genero: "Rock",
      reproducciones: 9870,
      posicion: 2,
      urlImagen: "https://picsum.photos/300/300?random=2"
    },
    {
      id: "4",
      titulo: "Hotel California",
      autor: "Eagles",
      genero: "Rock",
      reproducciones: 7650,
      posicion: 3,
      urlImagen: "https://picsum.photos/300/300?random=4"
    },
    {
      id: "6",
      titulo: "Stairway to Heaven",
      autor: "Led Zeppelin",
      genero: "Rock",
      reproducciones: 7120,
      posicion: 4,
      urlImagen: "https://picsum.photos/300/300?random=6"
    }
  ],
  trending: [
    {
      id: "14",
      titulo: "DDU-DU DDU-DU",
      autor: "BLACKPINK",
      genero: "K-pop",
      reproducciones: 5670,
      posicion: 1,
      urlImagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center"
    },
    {
      id: "15",
      titulo: "Feel Special",
      autor: "TWICE",
      genero: "K-pop",
      reproducciones: 4890,
      posicion: 2,
      urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
    },
    {
      id: "17",
      titulo: "Boy With Luv",
      autor: "BTS",
      genero: "K-pop",
      reproducciones: 4230,
      posicion: 3,
      urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
    },
    {
      id: "18",
      titulo: "As If It's Your Last",
      autor: "BLACKPINK",
      genero: "K-pop",
      reproducciones: 3980,
      posicion: 4,
      urlImagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center"
    }
  ]
};

export async function GET() {
  // Obtener todas las keys de reproducciones
  const keys = await redis.keys('reproducciones:*');
  const rankings = [];
  for (const key of keys) {
    const count = await redis.get(key);
    const contenido = key.replace('reproducciones:', '');
    rankings.push({ contenido, reproducciones: parseInt(count) });
  }
  rankings.sort((a, b) => b.reproducciones - a.reproducciones);
  return new Response(JSON.stringify(rankings), { status: 200 });
} 