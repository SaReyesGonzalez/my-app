import redis from '../../../lib/redis';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genero = searchParams.get('genero');
  // Obtener todas las keys de reproducciones
  const keys = await redis.keys('reproducciones:*');
  const rankings = [];
  for (const key of keys) {
    const count = await redis.get(key);
    const contenido = key.replace('reproducciones:', '');
    rankings.push({ contenido, reproducciones: parseInt(count) });
  }
  rankings.sort((a, b) => b.reproducciones - a.reproducciones);
  if (genero !== null && genero !== undefined) {
    // ... lógica usando genero
  }
  return new Response(JSON.stringify(rankings), { status: 200 });
} 