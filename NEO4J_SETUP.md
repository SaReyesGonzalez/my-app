# Configuración de Neo4j Aura

Este documento explica cómo configurar y usar Neo4j Aura en el proyecto de plataforma de streaming.

## Configuración Inicial

### 1. Variables de Entorno

Asegúrate de tener las siguientes variables en tu archivo `.env.local`:

```env
# Neo4j Aura
NEO4J_URI=bolt://your-aura-instance.neo4j.io:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-password
```

### 2. Instalación de Dependencias

```bash
npm install
```

## Estructura de la Base de Datos

### Nodos Principales

- **Usuario**: Representa a los usuarios de la plataforma
- **Genero**: Géneros musicales
- **Artista**: Artistas musicales
- **Cancion**: Canciones individuales
- **Album**: Álbumes de música
- **Playlist**: Listas de reproducción

### Relaciones Principales

- `(Usuario)-[:PREFIERE]->(Genero)`: Usuario prefiere un género
- `(Usuario)-[:SIGUE]->(Artista)`: Usuario sigue a un artista
- `(Usuario)-[:CREA]->(Playlist)`: Usuario crea una playlist
- `(Artista)-[:CANTE]->(Cancion)`: Artista canta una canción
- `(Cancion)-[:PERTENECE]->(Album)`: Canción pertenece a un álbum
- `(Cancion)-[:ES_GENERO]->(Genero)`: Canción es de un género

## Endpoints Disponibles

### 1. Prueba de Conexión
```bash
GET /api/neo4j/test
```

### 2. Ejecutar Consulta Cypher Personalizada
```bash
POST /api/neo4j/test
Content-Type: application/json

{
  "query": "MATCH (u:Usuario) RETURN u LIMIT 5",
  "parameters": {}
}
```

### 3. Gestión de Usuarios
```bash
# Crear usuario
POST /api/neo4j/users
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Nombre Usuario"
}

# Buscar usuario por email
GET /api/neo4j/users?email=usuario@ejemplo.com

# Buscar usuario por ID
GET /api/neo4j/users?id=user-id-here
```

## Consultas Cypher Útiles

### Crear Usuario
```cypher
CREATE (u:Usuario {
  id: $id,
  email: $email,
  nombre: $nombre,
  contraseñaHash: $contraseñaHash,
  rol: $rol,
  fechaRegistro: datetime($fechaRegistro),
  generosFavoritos: $generosFavoritos,
  artistasFavoritos: $artistasFavoritos
})
```

### Buscar Usuario por Email
```cypher
MATCH (u:Usuario {email: $email})
RETURN u
```

### Usuarios que Prefieren un Género
```cypher
MATCH (u:Usuario)-[:PREFIERE]->(g:Genero {nombre: $genero})
RETURN u, g
```

### Recomendaciones de Artistas
```cypher
MATCH (u:Usuario)-[:PREFIERE]->(g:Genero)<-[:ES_GENERO]-(c:Cancion)-[:CANTE]->(a:Artista)
WHERE u.id = $usuarioId
RETURN DISTINCT a
LIMIT 10
```

## Ventajas de Usar Neo4j

1. **Relaciones Complejas**: Fácil modelado de relaciones entre usuarios, artistas, géneros y canciones
2. **Recomendaciones**: Consultas eficientes para sistemas de recomendación
3. **Análisis de Redes**: Análisis de patrones de escucha y preferencias
4. **Escalabilidad**: Neo4j Aura proporciona escalabilidad automática
5. **Consultas Declarativas**: Cypher es intuitivo para consultas complejas

## Próximos Pasos

1. Configurar índices para mejorar el rendimiento
2. Implementar más casos de uso específicos para Neo4j
3. Crear endpoints para recomendaciones
4. Implementar análisis de redes sociales
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