import { getNeo4jSession } from '../../../lib/neo4j';

export async function GET(request: Request) {
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