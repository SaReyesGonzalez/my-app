import neo4j, { Driver, Session } from 'neo4j-driver';

if (!process.env.NEO4J_URI) {
  throw new Error('Por favor, define NEO4J_URI en el archivo .env.local');
}

if (!process.env.NEO4J_USER) {
  throw new Error('Por favor, define NEO4J_USER en el archivo .env.local');
}

if (!process.env.NEO4J_PASSWORD) {
  throw new Error('Por favor, define NEO4J_PASSWORD en el archivo .env.local');
}

let driver: Driver;

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usa una variable global para que la conexión persista entre recargas
  let globalWithNeo4j = global as typeof globalThis & {
    _neo4jDriver?: Driver;
  };

  if (!globalWithNeo4j._neo4jDriver) {
    driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
      {
        maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 horas
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 2 * 60 * 1000, // 2 minutos
        disableLosslessIntegers: true
      }
    );
    globalWithNeo4j._neo4jDriver = driver;
  } else {
    driver = globalWithNeo4j._neo4jDriver;
  }
} else {
  // En producción, es mejor no usar una variable global
  driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    {
      maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 horas
      maxConnectionPoolSize: 50,
      connectionAcquisitionTimeout: 2 * 60 * 1000, // 2 minutos
      disableLosslessIntegers: true
    }
  );
}

// Verificar la conexión
driver.verifyConnectivity()
  .then(() => {
    console.log('Conectado a Neo4j Aura exitosamente');
  })
  .catch((error: any) => {
    console.error('Error al conectar con Neo4j Aura:', error);
  });

export default driver;

// Función helper para ejecutar consultas
export async function executeQuery<T>(
  query: string,
  parameters: Record<string, any> = {}
): Promise<T[]> {
  const session: Session = driver.session();
  try {
    const result = await session.run(query, parameters);
    return result.records.map((record: any) => {
      const obj: any = {};
      record.keys.forEach((key: any) => {
        obj[key] = record.get(key);
      });
      return obj;
    });
  } finally {
    await session.close();
  }
}

// Función helper para ejecutar una sola consulta
export async function executeSingleQuery<T>(
  query: string,
  parameters: Record<string, any> = {}
): Promise<T | null> {
  const results = await executeQuery<T>(query, parameters);
  return results.length > 0 ? results[0] : null;
} 