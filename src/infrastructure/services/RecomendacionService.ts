import { getNeo4jSession } from '../../../lib/neo4j';
import { Usuario } from '../../entities/models/Usuario';

export interface RecomendacionContenido {
  id: string;
  titulo: string;
  tipo: 'cancion' | 'podcast';
  score: number;
  autor: string;
  genero: string;
}

export class RecomendacionService {
  
  async inicializarGrafo(): Promise<void> {
    const session = await getNeo4jSession();
    
    try {
      // Crear índices para mejorar rendimiento
      await session.run('CREATE INDEX usuario_id IF NOT EXISTS FOR (u:Usuario) ON (u.id)');
      await session.run('CREATE INDEX contenido_id IF NOT EXISTS FOR (c:Contenido) ON (c.id)');
      await session.run('CREATE INDEX genero_id IF NOT EXISTS FOR (g:Genero) ON (g.id)');
      await session.run('CREATE INDEX autor_id IF NOT EXISTS FOR (a:Autor) ON (a.id)');
      
      console.log('Índices de Neo4j creados correctamente');
    } finally {
      await session.close();
    }
  }

  async crearUsuario(usuario: Usuario): Promise<void> {
    const session = await getNeo4jSession();
    
    try {
      const query = `
        MERGE (u:Usuario {id: $id})
        SET u.nombre = $nombre, u.email = $email, u.rol = $rol
      `;
      
      await session.run(query, {
        id: usuario.getId(),
        nombre: usuario.getNombre() || '',
        email: usuario.getEmail() || '',
        rol: usuario.getRol()
      });
    } finally {
      await session.close();
    }
  }

  async registrarReproduccion(usuarioId: string, contenidoId: string, tipo: 'cancion' | 'podcast', duracion: number): Promise<void> {
    const session = await getNeo4jSession();
    
    try {
      // Crear relación de reproducción
      const query = `
        MATCH (u:Usuario {id: $usuarioId})
        MERGE (c:Contenido {id: $contenidoId})
        SET c.tipo = $tipo
        MERGE (u)-[r:REPRODUJO]->(c)
        SET r.duracion = $duracion, r.fecha = datetime()
        SET r.peso = CASE 
          WHEN $duracion > 30 THEN 1.0
          WHEN $duracion > 10 THEN 0.7
          ELSE 0.3
        END
      `;
      
      await session.run(query, {
        usuarioId,
        contenidoId,
        tipo,
        duracion
      });
    } finally {
      await session.close();
    }
  }

  async registrarFavorito(usuarioId: string, contenidoId: string): Promise<void> {
    const session = await getNeo4jSession();
    
    try {
      const query = `
        MATCH (u:Usuario {id: $usuarioId})
        MERGE (c:Contenido {id: $contenidoId})
        MERGE (u)-[r:FAVORITO]->(c)
        SET r.fecha = datetime()
      `;
      
      await session.run(query, { usuarioId, contenidoId });
    } finally {
      await session.close();
    }
  }

  async conectarContenidoGenero(contenidoId: string, generoId: string): Promise<void> {
    const session = await getNeo4jSession();
    
    try {
      const query = `
        MERGE (c:Contenido {id: $contenidoId})
        MERGE (g:Genero {id: $generoId})
        MERGE (c)-[:PERTENECE_A]->(g)
      `;
      
      await session.run(query, { contenidoId, generoId });
    } finally {
      await session.close();
    }
  }

  async conectarContenidoAutor(contenidoId: string, autorId: string): Promise<void> {
    const session = await getNeo4jSession();
    
    try {
      const query = `
        MERGE (c:Contenido {id: $contenidoId})
        MERGE (a:Autor {id: $autorId})
        MERGE (c)-[:CREADO_POR]->(a)
      `;
      
      await session.run(query, { contenidoId, autorId });
    } finally {
      await session.close();
    }
  }

  async obtenerRecomendacionesUsuario(usuarioId: string, limite: number = 10): Promise<RecomendacionContenido[]> {
    const session = await getNeo4jSession();
    
    try {
      // Algoritmo de recomendación basado en colaborative filtering
      const query = `
        MATCH (u:Usuario {id: $usuarioId})-[r1:REPRODUJO]->(c1:Contenido)
        MATCH (u2:Usuario)-[r2:REPRODUJO]->(c1)
        WHERE u2.id <> $usuarioId
        MATCH (u2)-[r3:REPRODUJO]->(c2:Contenido)
        WHERE c2.id <> c1.id
        AND NOT EXISTS((u)-[:REPRODUJO]->(c2))
        WITH c2, COUNT(*) as peso
        ORDER BY peso DESC
        LIMIT $limite
        RETURN c2.id as id, c2.titulo as titulo, c2.tipo as tipo, peso as score
      `;
      
      const result = await session.run(query, { usuarioId, limite });
      
      return result.records.map(record => ({
        id: record.get('id'),
        titulo: record.get('titulo') || 'Sin título',
        tipo: record.get('tipo'),
        score: record.get('score').toNumber(),
        autor: '', // Se puede obtener con otra consulta
        genero: '' // Se puede obtener con otra consulta
      }));
    } finally {
      await session.close();
    }
  }

  async obtenerRecomendacionesPorGenero(usuarioId: string, generoId: string, limite: number = 10): Promise<RecomendacionContenido[]> {
    const session = await getNeo4jSession();
    
    try {
      const query = `
        MATCH (u:Usuario {id: $usuarioId})-[r:REPRODUJO]->(c:Contenido)-[:PERTENECE_A]->(g:Genero {id: $generoId})
        WITH g, COUNT(*) as reproducciones
        MATCH (c2:Contenido)-[:PERTENECE_A]->(g)
        WHERE NOT EXISTS((u)-[:REPRODUJO]->(c2))
        RETURN c2.id as id, c2.titulo as titulo, c2.tipo as tipo, reproducciones as score
        ORDER BY score DESC
        LIMIT $limite
      `;
      
      const result = await session.run(query, { usuarioId, generoId, limite });
      
      return result.records.map(record => ({
        id: record.get('id'),
        titulo: record.get('titulo') || 'Sin título',
        tipo: record.get('tipo'),
        score: record.get('score').toNumber(),
        autor: '',
        genero: generoId
      }));
    } finally {
      await session.close();
    }
  }

  async obtenerUsuariosSimilares(usuarioId: string, limite: number = 5): Promise<string[]> {
    const session = await getNeo4jSession();
    
    try {
      const query = `
        MATCH (u1:Usuario {id: $usuarioId})-[r1:REPRODUJO]->(c:Contenido)<-[r2:REPRODUJO]-(u2:Usuario)
        WHERE u1.id <> u2.id
        WITH u2, COUNT(c) as contenidoComun
        ORDER BY contenidoComun DESC
        LIMIT $limite
        RETURN u2.id as id
      `;
      
      const result = await session.run(query, { usuarioId, limite });
      
      return result.records.map(record => record.get('id'));
    } finally {
      await session.close();
    }
  }

  async obtenerContenidoPopular(limite: number = 20): Promise<RecomendacionContenido[]> {
    const session = await getNeo4jSession();
    
    try {
      const query = `
        MATCH (u:Usuario)-[r:REPRODUJO]->(c:Contenido)
        WITH c, COUNT(r) as reproducciones
        ORDER BY reproducciones DESC
        LIMIT $limite
        RETURN c.id as id, c.titulo as titulo, c.tipo as tipo, reproducciones as score
      `;
      
      const result = await session.run(query, { limite });
      
      return result.records.map(record => ({
        id: record.get('id'),
        titulo: record.get('titulo') || 'Sin título',
        tipo: record.get('tipo'),
        score: record.get('score').toNumber(),
        autor: '',
        genero: ''
      }));
    } finally {
      await session.close();
    }
  }

  async limpiarDatosAntiguos(diasAntiguedad: number = 30): Promise<void> {
    const session = await getNeo4jSession();
    
    try {
      const query = `
        MATCH ()-[r:REPRODUJO]->()
        WHERE r.fecha < datetime() - duration({days: $dias})
        DELETE r
      `;
      
      await session.run(query, { dias: diasAntiguedad });
    } finally {
      await session.close();
    }
  }
} 