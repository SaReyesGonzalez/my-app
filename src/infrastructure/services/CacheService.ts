import redis from '../../../lib/redis';

export interface ContenidoCache {
  id: string;
  titulo: string;
  tipo: 'cancion' | 'podcast';
  autor: string;
  genero: string;
  urlAudio: string;
  urlImagen?: string;
  metadata: Record<string, unknown>;
}

export interface UsuarioCache {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  favoritos: string[];
  playlists: string[];
}

export interface RecomendacionCache {
  id: string;
  titulo: string;
  tipo: 'cancion' | 'podcast';
  score: number;
  autor: string;
  genero: string;
}

export interface RankingItem {
  id: string;
  titulo: string;
  reproducciones: number;
  score: number;
}

export class CacheService {
  private readonly DEFAULT_TTL = 3600; // 1 hora en segundos

  // Contadores de reproducción
  async incrementarContadorReproduccion(contenidoId: string): Promise<number> {
    const key = `contador:reproduccion:${contenidoId}`;
    return await redis.incr(key);
  }

  async obtenerContadorReproduccion(contenidoId: string): Promise<number> {
    const key = `contador:reproduccion:${contenidoId}`;
    const valor = await redis.get(key);
    return valor ? parseInt(valor) : 0;
  }

  async sincronizarContadorReproduccion(contenidoId: string, valor: number): Promise<void> {
    const key = `contador:reproduccion:${contenidoId}`;
    await redis.set(key, valor.toString());
  }

  // Caché de recomendaciones
  async guardarRecomendaciones(usuarioId: string, recomendaciones: RecomendacionCache[]): Promise<void> {
    const key = `recomendaciones:${usuarioId}`;
    await redis.setex(key, 1800, JSON.stringify(recomendaciones)); // 30 minutos
  }

  async obtenerRecomendaciones(usuarioId: string): Promise<RecomendacionCache[] | null> {
    const key = `recomendaciones:${usuarioId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async invalidarRecomendaciones(usuarioId: string): Promise<void> {
    const key = `recomendaciones:${usuarioId}`;
    await redis.del(key);
  }

  // Caché de contenido
  async guardarContenido(contenidoId: string, contenido: ContenidoCache, ttl: number = this.DEFAULT_TTL): Promise<void> {
    const key = `contenido:${contenidoId}`;
    await redis.setex(key, ttl, JSON.stringify(contenido));
  }

  async obtenerContenido(contenidoId: string): Promise<ContenidoCache | null> {
    const key = `contenido:${contenidoId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async invalidarContenido(contenidoId: string): Promise<void> {
    const key = `contenido:${contenidoId}`;
    await redis.del(key);
  }

  // Caché de usuario
  async guardarUsuario(usuarioId: string, usuario: UsuarioCache, ttl: number = this.DEFAULT_TTL): Promise<void> {
    const key = `usuario:${usuarioId}`;
    await redis.setex(key, ttl, JSON.stringify(usuario));
  }

  async obtenerUsuario(usuarioId: string): Promise<UsuarioCache | null> {
    const key = `usuario:${usuarioId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async invalidarUsuario(usuarioId: string): Promise<void> {
    const key = `usuario:${usuarioId}`;
    await redis.del(key);
  }

  // Caché de búsquedas
  async guardarResultadoBusqueda(query: string, resultados: ContenidoCache[]): Promise<void> {
    const key = `busqueda:${Buffer.from(query).toString('base64')}`;
    await redis.setex(key, 900, JSON.stringify(resultados)); // 15 minutos
  }

  async obtenerResultadoBusqueda(query: string): Promise<ContenidoCache[] | null> {
    const key = `busqueda:${Buffer.from(query).toString('base64')}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Rankings y listas
  async guardarRanking(nombre: string, items: RankingItem[]): Promise<void> {
    const key = `ranking:${nombre}`;
    await redis.setex(key, 3600, JSON.stringify(items)); // 1 hora
  }

  async obtenerRanking(nombre: string): Promise<RankingItem[] | null> {
    const key = `ranking:${nombre}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Estadísticas en tiempo real
  async incrementarEstadistica(estadistica: string, valor: number = 1): Promise<number> {
    const key = `stats:${estadistica}`;
    return await redis.incrby(key, valor);
  }

  async obtenerEstadistica(estadistica: string): Promise<number> {
    const key = `stats:${estadistica}`;
    const valor = await redis.get(key);
    return valor ? parseInt(valor) : 0;
  }

  async resetearEstadistica(estadistica: string): Promise<void> {
    const key = `stats:${estadistica}`;
    await redis.del(key);
  }

  // Sesiones activas
  async registrarSesionActiva(usuarioId: string): Promise<void> {
    const key = `sesiones:activas`;
    await redis.sadd(key, usuarioId);
    await redis.expire(key, 86400); // 24 horas
  }

  async removerSesionActiva(usuarioId: string): Promise<void> {
    const key = `sesiones:activas`;
    await redis.srem(key, usuarioId);
  }

  async obtenerSesionesActivas(): Promise<string[]> {
    const key = `sesiones:activas`;
    return await redis.smembers(key);
  }

  async contarSesionesActivas(): Promise<number> {
    const key = `sesiones:activas`;
    return await redis.scard(key);
  }

  // Limpieza de caché
  async limpiarCachePorPatron(patron: string): Promise<void> {
    const keys = await redis.keys(patron);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  async limpiarTodoCache(): Promise<void> {
    await redis.flushdb();
  }

  // Métricas de caché
  async obtenerMetricasCache(): Promise<{ hits: number; misses: number; keys: number }> {
    const info = await redis.info('stats');
    const lines = info.split('\r\n');
    
    let hits = 0;
    let misses = 0;
    
    for (const line of lines) {
      if (line.startsWith('keyspace_hits:')) {
        hits = parseInt(line.split(':')[1]);
      } else if (line.startsWith('keyspace_misses:')) {
        misses = parseInt(line.split(':')[1]);
      }
    }
    
    const keys = await redis.dbsize();
    
    return { hits, misses, keys };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await redis.ping();
      return true;
    } catch {
      return false;
    }
  }
} 