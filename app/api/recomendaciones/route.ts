import { NextResponse } from 'next/server';
import { getNeo4jSession } from '../../../lib/neo4j';

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

export async function GET(request) {
  if (request.headers.get('x-user-type') !== 'registrado') {
    return new Response('Solo usuarios registrados pueden recibir recomendaciones', { status: 401 });
  }
  const usuario = request.headers.get('x-user-name'); // Asume que el nombre de usuario está en la cabecera
  const session = await getNeo4jSession();
  // Consulta Cypher de ejemplo: recomendar canciones del género más escuchado por el usuario
  const result = await session.run(`
    MATCH (u:Usuario {nombre: $usuario})-[:ESCOCHO]->(c)-[:PERTENECE_A]->(g:Genero)
    WITH g, count(*) as freq
    ORDER BY freq DESC LIMIT 1
    MATCH (c2)-[:PERTENECE_A]->(g)
    RETURN c2.titulo as recomendado LIMIT 5
  `, { usuario });
  await session.close();
  const recomendaciones = result.records.map(r => r.get('recomendado'));
  return new Response(JSON.stringify(recomendaciones), { status: 200 });
} 