const neo4j = require('neo4j-driver');

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'neo4j';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

async function seed() {
  try {
    // Crear usuarios
    await session.run(`
      CREATE (u1:Usuario {nombre: 'Juan', email: 'juan@correo.com'})
      CREATE (u2:Usuario {nombre: 'Ana', email: 'ana@correo.com'})
    `);

    // Crear artistas y géneros
    await session.run(`
      CREATE (a1:Artista {nombre: 'Artista 1'})
      CREATE (a2:Artista {nombre: 'Artista 2'})
      CREATE (p1:Podcaster {nombre: 'Podcaster 1'})
      CREATE (g1:Genero {nombre: 'Pop'})
      CREATE (g2:Genero {nombre: 'Rock'})
      CREATE (g3:Genero {nombre: 'Educativo'})
    `);

    // Crear canciones y podcasts
    await session.run(`
      CREATE (c1:Cancion {titulo: 'Canción 1'})
      CREATE (c2:Cancion {titulo: 'Canción 2'})
      CREATE (p:Podcast {titulo: 'Podcast 1'})
    `);

    // Relaciones: canciones/artistas/géneros
    await session.run(`
      MATCH (c1:Cancion {titulo: 'Canción 1'}), (a1:Artista {nombre: 'Artista 1'}), (g1:Genero {nombre: 'Pop'})
      CREATE (c1)-[:INTERPRETADA_POR]->(a1)
      CREATE (c1)-[:PERTENECE_A]->(g1)
      MATCH (c2:Cancion {titulo: 'Canción 2'}), (a2:Artista {nombre: 'Artista 2'}), (g2:Genero {nombre: 'Rock'})
      CREATE (c2)-[:INTERPRETADA_POR]->(a2)
      CREATE (c2)-[:PERTENECE_A]->(g2)
      MATCH (p:Podcast {titulo: 'Podcast 1'}), (p1:Podcaster {nombre: 'Podcaster 1'}), (g3:Genero {nombre: 'Educativo'})
      CREATE (p)-[:INTERPRETADA_POR]->(p1)
      CREATE (p)-[:PERTENECE_A]->(g3)
    `);

    // Relaciones de usuarios con contenido
    await session.run(`
      MATCH (u1:Usuario {nombre: 'Juan'}), (c1:Cancion {titulo: 'Canción 1'}), (p:Podcast {titulo: 'Podcast 1'})
      CREATE (u1)-[:FAVORITO]->(c1)
      CREATE (u1)-[:ESCOCHO]->(c1)
      CREATE (u1)-[:ESCOCHO]->(p)
      MATCH (u2:Usuario {nombre: 'Ana'}), (c2:Cancion {titulo: 'Canción 2'})
      CREATE (u2)-[:FAVORITO]->(c2)
      CREATE (u2)-[:ESCOCHO]->(c2)
    `);

    console.log('Datos de prueba insertados en Neo4j');
  } catch (error) {
    console.error('Error insertando datos en Neo4j:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed(); 