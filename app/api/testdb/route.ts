import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { getNeo4jSession } from '../../../lib/neo4j';
import redis from '../../../lib/redis';

export async function GET() {
  const result: Record<string, string> = {};
  // MongoDB
  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 });
    result.mongo = 'ok';
  } catch {
    result.mongo = 'error';
  }
  // Neo4j
  try {
    const session = await getNeo4jSession();
    await session.run('RETURN 1');
    await session.close();
    result.neo4j = 'ok';
  } catch {
    result.neo4j = 'error';
  }
  // Redis
  try {
    await redis.ping();
    result.redis = 'ok';
  } catch {
    result.redis = 'error';
  }
  return NextResponse.json(result);
} 