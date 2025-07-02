import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db/neo4j';

export async function GET() {
  try {
    // Consulta simple para verificar la conexión
    const result = await executeQuery('RETURN "Hello from Neo4j!" as message');
    
    return NextResponse.json({
      success: true,
      message: 'Conexión a Neo4j exitosa',
      data: result
    });
  } catch (error: any) {
    console.error('Error al conectar con Neo4j:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al conectar con Neo4j',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { query, parameters } = await request.json();
    
    if (!query) {
      return NextResponse.json({
        success: false,
        message: 'Se requiere una consulta Cypher'
      }, { status: 400 });
    }
    
    const result = await executeQuery(query, parameters || {});
    
    return NextResponse.json({
      success: true,
      message: 'Consulta ejecutada exitosamente',
      data: result
    });
  } catch (error: any) {
    console.error('Error al ejecutar consulta en Neo4j:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al ejecutar consulta en Neo4j',
      error: error.message
    }, { status: 500 });
  }
} 