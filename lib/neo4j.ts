import neo4j, { Driver, Session } from 'neo4j-driver'

let driver: Driver

export function getNeo4jDriver(): Driver {
  if (!driver) {
    driver = neo4j.driver(
      process.env.NEO4J_URI || 'bolt://localhost:7687',
      neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASSWORD || 'password'
      )
    )
  }
  return driver
}

export async function getNeo4jSession(): Promise<Session> {
  const driver = getNeo4jDriver()
  return driver.session()
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