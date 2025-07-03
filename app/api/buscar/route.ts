import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET(request: Request) {
  const client = await clientPromise;
  const db = client.db();
  const { searchParams } = new URL(request.url);
  const filtro: Record<string, string> = {};
  if (searchParams.get('genero')) {
    const genero = searchParams.get('genero');
    if (genero) filtro.genero = genero;
  }
  if (searchParams.get('tipo')) {
    const tipo = searchParams.get('tipo');
    if (tipo) filtro.tipo = tipo;
  }
  if (searchParams.get('autor')) {
    const autor = searchParams.get('autor');
    if (autor) filtro.autor = autor;
  }
  const resultados = await db.collection('canciones').find(filtro).toArray();
  return NextResponse.json(resultados);
} 