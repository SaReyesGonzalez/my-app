import neo4j, { Driver, Session } from 'neo4j-driver'

let driver: Driver

export function getNeo4jDriver(): Driver {
  if (!process.env.NEO4J_URI || !process.env.NEO4J_USER || !process.env.NEO4J_PASSWORD) {
    throw new Error('Faltan variables de entorno para Neo4j: NEO4J_URI, NEO4J_USER o NEO4J_PASSWORD')
  }
  if (!driver) {
    driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(
        process.env.NEO4J_USER,
        process.env.NEO4J_PASSWORD
      )
    )
  }
  return driver
}

export async function getNeo4jSession(): Promise<Session> {
  console.log('Intentando conectar a Neo4j...');
  
  try {
    const driver = getNeo4jDriver();
    const session = driver.session({ database: 'app' });
    console.log('Sesión de Neo4j creada correctamente.');
    return session;
  } catch (error) {
    console.error('Error al intentar conectar a Neo4j:', error);
    throw error;
  }
}

export async function closeNeo4jConnection() {
  if (driver) {
    await driver.close()
  }
}

// Verificar conexión
export async function testNeo4jConnection() {
  try {
    const session = await getNeo4jSession()
    await session.run('RETURN 1 as test')
    await session.close()
    console.log('Neo4j connected successfully')
    return true
  } catch (error) {
    console.error('Neo4j connection failed:', error)
    return false
  }
} 