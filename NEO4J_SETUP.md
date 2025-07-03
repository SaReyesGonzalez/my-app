# Configuración de Neo4j Aura para Recomendaciones Musicales

Este documento explica cómo configurar y usar Neo4j Aura para el sistema de recomendaciones musicales de la plataforma de streaming.

## Configuración Inicial

### 1. Variables de Entorno

Asegúrate de tener las siguientes variables en tu archivo `.env.local`:

```env
# Neo4j Aura
NEO4J_URI=neo4j+s://356234f6.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=4FZJjHYO8vO7FENyIAtVyhx1pfxBTvrpGXRC6Cmokes
NEO4J_DATABASE=neo4j
```

### 2. Instalación de Dependencias

```bash
npm install
```

## Propósito de Neo4j en el Proyecto

**Neo4j NO se usa para usuarios registrados** (eso se maneja con MongoDB). Neo4j se usa específicamente para:

- 🎵 **Recomendaciones de canciones** basadas en preferencias
- 👥 **Análisis de relaciones** entre usuarios y música
- 🎼 **Descubrimiento de música** por género y similitud
- 📊 **Análisis de patrones** de escucha
- 🔗 **Relaciones complejas** entre canciones, autores y géneros

## Estructura de la Base de Datos

### Nodos Principales

- **Usuario**: Usuarios que escuchan música (referencia desde MongoDB)
- **Cancion**: Canciones individuales
- **Autor**: Autores/artistas musicales
- **Genero**: Géneros musicales

### Relaciones Principales

- `(Usuario)-[:ESCUCHA]->(Cancion)`: Usuario escucha una canción
- `(Autor)-[:CANTA]->(Cancion)`: Autor canta una canción
- `(Cancion)-[:ES_GENERO]->(Genero)`: Canción pertenece a un género

## Endpoints Disponibles

### 1. Prueba de Conexión
```bash
GET /api/neo4j/test
```

### 2. Recomendaciones Musicales
```bash
# Recomendaciones por usuario
GET /api/neo4j/recommendations?tipo=usuario&usuarioId=123&limite=10

# Recomendaciones por género
GET /api/neo4j/recommendations?tipo=genero&generoId=456&limite=10

# Canciones similares
GET /api/neo4j/recommendations?tipo=similares&cancionId=789&limite=5

# Autores recomendados
GET /api/neo4j/recommendations?tipo=autores&usuarioId=123&limite=5

# Tendencias
GET /api/neo4j/recommendations?tipo=tendencias&limite=10

# Usuarios con gustos similares
GET /api/neo4j/recommendations?tipo=usuarios_similares&usuarioId=123&limite=5
```

### 3. Registrar Reproducción
```bash
POST /api/neo4j/recommendations
Content-Type: application/json

{
  "usuarioId": "123",
  "cancionId": "456"
}
```

## Consultas Cypher Útiles

### Crear Canción con Relaciones
```cypher
MERGE (c:Cancion {
  id: $cancionId,
  titulo: $titulo,
  duracion: $duracion
})
MERGE (a:Autor {
  id: $autorId,
  nombre: $nombre,
  biografia: $biografia
})
MERGE (g:Genero {
  id: $generoId,
  nombre: $generoNombre
})
MERGE (a)-[:CANTA]->(c)
MERGE (c)-[:ES_GENERO]->(g)
```

### Recomendaciones por Usuario
```cypher
MATCH (u:Usuario {id: $usuarioId})-[:ESCUCHA]->(c1:Cancion)-[:ES_GENERO]->(g:Genero)<-[:ES_GENERO]-(c2:Cancion)
WHERE c1 <> c2
WITH c2, count(*) as peso
ORDER BY peso DESC
LIMIT $limite
RETURN c2
```

### Canciones Similares
```cypher
MATCH (c1:Cancion {id: $cancionId})-[:ES_GENERO]->(g:Genero)<-[:ES_GENERO]-(c2:Cancion)
WHERE c1 <> c2
WITH c2, count(*) as similitud
ORDER BY similitud DESC
LIMIT $limite
RETURN c2
```

### Tendencias
```cypher
MATCH (u:Usuario)-[:ESCUCHA]->(c:Cancion)
WITH c, count(*) as reproducciones
ORDER BY reproducciones DESC
LIMIT $limite
RETURN c
```

## Ventajas de Usar Neo4j para Recomendaciones

1. **Relaciones Complejas**: Fácil modelado de relaciones entre usuarios, canciones, autores y géneros
2. **Recomendaciones Inteligentes**: Consultas eficientes para sistemas de recomendación basados en grafos
3. **Análisis de Redes**: Análisis de patrones de escucha y preferencias
4. **Escalabilidad**: Neo4j Aura proporciona escalabilidad automática
5. **Consultas Declarativas**: Cypher es intuitivo para consultas complejas de relaciones

## Arquitectura del Sistema

```
MongoDB (Usuarios) ←→ Neo4j (Recomendaciones) ←→ Redis (Cache)
     ↓                      ↓                        ↓
  Autenticación        Relaciones Musicales      Sesiones
  Registro            Recomendaciones           Cache
  Perfiles            Análisis de Patrones      Datos Temporales
```

## Próximos Pasos

1. Configurar índices para mejorar el rendimiento
2. Implementar algoritmos de recomendación más avanzados
3. Crear dashboards de análisis de datos
4. Implementar análisis de sentimientos
5. Optimizar consultas para grandes volúmenes de datos

## Troubleshooting

### Error de Conexión
- Verifica las credenciales en `.env.local`
- Asegúrate de que la instancia de Neo4j Aura esté activa
- Verifica que el firewall permita conexiones al puerto 7687

### Errores de Consulta
- Usa el endpoint `/api/neo4j/test` para probar consultas
- Verifica la sintaxis de Cypher
- Revisa los logs del servidor para errores detallados

### Datos de Prueba
Para probar el sistema, puedes crear datos de ejemplo usando el endpoint de prueba:

```bash
POST /api/neo4j/test
{
  "query": "CREATE (u:Usuario {id: 'test-user', nombre: 'Usuario Test'}) RETURN u"
}
``` 