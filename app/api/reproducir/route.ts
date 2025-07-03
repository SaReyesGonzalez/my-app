import { NextResponse } from 'next/server';
import redis from '../../../lib/redis';
import clientPromise from '../../../lib/mongodb';
import { getNeo4jSession } from '../../../lib/neo4j';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const usuario = body.usuario || body.user || '';
    const contenido = body.contenidoId || body.contenido || '';
    if (!usuario || !contenido) {
      return NextResponse.json(
        { error: 'Faltan parámetros usuario o contenido' },
        { status: 400 }
      );
    }

    // Incrementar contador en Redis
    await redis.incr(`reproducciones:${contenido}`);
    // Actualizar historial en MongoDB
    const client = await clientPromise;
    await client.db().collection('historial').insertOne({ usuario, contenido, fecha: new Date() });
    // Crear relación de escucha en Neo4j
    const session = await getNeo4jSession();
    await session.run('MATCH (u:Usuario {nombre: $usuario}), (c) WHERE c.titulo = $contenido CREATE (u)-[:ESCOCHO]->(c)', { usuario, contenido });
    await session.close();

    // Simular contador de reproducciones (en producción esto vendría de Redis)
    const contadoresSimulados: { [key: string]: number } = {
      "1": 11560,
      "2": 9870,
      "4": 7650,
      "6": 7120,
      "7": 15420,
      "8": 12850,
      "9": 8230,
      "11": 10230,
      "12": 8950,
      "13": 6890,
      "14": 5670,
      "15": 4890,
      "17": 4230,
      "18": 3980
    };
    
    const contadorActual = contadoresSimulados[contenido] || 0;
    const nuevoContador = contadorActual + 1;
    
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({ 
      success: true, 
      message: 'Reproducción registrada correctamente',
      contenido,
      contador: nuevoContador
    });
  } catch (error) {
    console.error('Error registrando reproducción:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 