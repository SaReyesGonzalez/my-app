# Sistema de Canciones y Reproducción

Este documento explica cómo agregar canciones y reproducirlas en la plataforma de streaming.

## Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MongoDB       │    │   Neo4j         │    │   Archivos/S3   │
│                 │    │                 │    │                 │
│ • Metadatos     │    │ • Relaciones    │    │ • Archivos      │
│ • Reproducciones│    │ • Recomendaciones│   │   de Audio      │
│ • URLs          │    │ • Análisis      │    │ • Imágenes      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API REST      │
                    │                 │
                    │ • Crear canciones│
                    │ • Reproducir    │
                    │ • Buscar        │
                    │ • Recomendaciones│
                    └─────────────────┘
```

## Flujo de Reproducción

### 1. Usuario Selecciona Canción
```javascript
// Frontend
const cancion = await fetch(`/api/canciones/${cancionId}/play`);
```

### 2. Sistema Procesa la Reproducción
- ✅ Verifica que la canción existe en MongoDB
- ✅ Incrementa contador de reproducciones en MongoDB
- ✅ Registra relación usuario-canción en Neo4j
- ✅ Retorna metadatos y URL del archivo de audio

### 3. Frontend Reproduce el Audio
```javascript
// El frontend usa la URL del archivo de audio para reproducir
const audio = new Audio(cancion.urlAudio);
audio.play();
```

## Endpoints Disponibles

### Crear Canción
```bash
POST /api/canciones
Content-Type: application/json

{
  "titulo": "Bohemian Rhapsody",
  "duracion": 354,
  "autorId": "queen",
  "generoId": "rock",
  "fechaLanzamiento": "1975-10-31",
  "albumId": "a-night-at-the-opera",
  "letra": "Is this the real life?",
  "urlAudio": "https://ejemplo.com/audio/bohemian-rhapsody.mp3",
  "urlPortada": "https://ejemplo.com/covers/bohemian-rhapsody.jpg"
}
```

### Buscar Canciones
```bash
# Todas las canciones
GET /api/canciones

# Por ID
GET /api/canciones?id=64f1234567890abcdef12345

# Por título
GET /api/canciones?titulo=bohemian

# Por autor
GET /api/canciones?autorId=queen

# Por género
GET /api/canciones?generoId=rock

# Con paginación
GET /api/canciones?limite=10&offset=0
```

### Reproducir Canción
```bash
# Obtener información de canción
GET /api/canciones/64f1234567890abcdef12345/play

# Registrar reproducción
POST /api/canciones/64f1234567890abcdef12345/play
```

### Recomendaciones
```bash
# Recomendaciones por usuario
GET /api/neo4j/recommendations?tipo=usuario&usuarioId=123

# Canciones similares
GET /api/neo4j/recommendations?tipo=similares&cancionId=456

# Tendencias
GET /api/neo4j/recommendations?tipo=tendencias
```

## Estructura de Datos

### MongoDB (Canciones)
```javascript
{
  _id: ObjectId,
  titulo: "Bohemian Rhapsody",
  duracion: 354, // segundos
  autorId: "queen",
  generoId: "rock",
  fechaLanzamiento: Date,
  albumId: "a-night-at-the-opera",
  letra: "Is this the real life?",
  urlAudio: "https://ejemplo.com/audio/bohemian-rhapsody.mp3",
  urlPortada: "https://ejemplo.com/covers/bohemian-rhapsody.jpg",
  reproducciones: 1250,
  createdAt: Date,
  updatedAt: Date
}
```

### Neo4j (Relaciones)
```cypher
// Usuario escucha canción
(Usuario)-[:ESCUCHA {fecha: datetime()}]->(Cancion)

// Autor canta canción
(Autor)-[:CANTA]->(Cancion)

// Canción pertenece a género
(Cancion)-[:ES_GENERO]->(Genero)
```

## Poblar Base de Datos

### 1. Ejecutar Script de Población
```bash
# Asegúrate de que el servidor esté corriendo
npm run dev

# En otra terminal, ejecuta el script
node scripts/populate-songs.js
```

### 2. Verificar Datos Creados
```bash
# Ver todas las canciones
curl http://localhost:4000/api/canciones

# Ver tendencias
curl http://localhost:4000/api/neo4j/recommendations?tipo=tendencias
```

## Almacenamiento de Archivos

### Opciones Recomendadas:

#### 1. **Amazon S3** (Recomendado para producción)
```javascript
// Subir archivo a S3
const s3 = new AWS.S3();
const upload = await s3.upload({
  Bucket: 'mi-bucket-audio',
  Key: `canciones/${cancionId}.mp3`,
  Body: audioBuffer
}).promise();

// URL resultante
const urlAudio = upload.Location;
```

#### 2. **Google Cloud Storage**
```javascript
const bucket = storage.bucket('mi-bucket-audio');
const file = bucket.file(`canciones/${cancionId}.mp3`);
await file.save(audioBuffer);
```

#### 3. **Azure Blob Storage**
```javascript
const containerClient = blobServiceClient.getContainerClient('audio');
const blockBlobClient = containerClient.getBlockBlobClient(`${cancionId}.mp3`);
await blockBlobClient.upload(audioBuffer, audioBuffer.length);
```

#### 4. **Almacenamiento Local** (Solo para desarrollo)
```javascript
// Guardar en carpeta public/audio/
const fs = require('fs');
const path = require('path');

const audioPath = path.join(process.cwd(), 'public', 'audio', `${cancionId}.mp3`);
fs.writeFileSync(audioPath, audioBuffer);
const urlAudio = `/audio/${cancionId}.mp3`;
```

## Ejemplo de Uso Completo

### 1. Crear Canción
```javascript
const nuevaCancion = {
  titulo: "Mi Nueva Canción",
  duracion: 240,
  autorId: "mi-autor",
  generoId: "pop",
  fechaLanzamiento: new Date(),
  urlAudio: "https://mi-s3-bucket.com/audio/mi-cancion.mp3",
  urlPortada: "https://mi-s3-bucket.com/covers/mi-cancion.jpg"
};

const response = await fetch('/api/canciones', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(nuevaCancion)
});

const { cancionId } = await response.json();
```

### 2. Reproducir Canción
```javascript
// Registrar reproducción
await fetch(`/api/canciones/${cancionId}/play`, {
  method: 'POST'
});

// Obtener información de la canción
const cancionResponse = await fetch(`/api/canciones/${cancionId}/play`);
const { cancion, cancionesSimilares } = await cancionResponse.json();

// Reproducir audio
const audio = new Audio(cancion.urlAudio);
audio.play();
```

### 3. Obtener Recomendaciones
```javascript
const recomendaciones = await fetch(
  `/api/neo4j/recommendations?tipo=usuario&usuarioId=${usuarioId}`
);
const { canciones } = await recomendaciones.json();
```

## Consideraciones de Rendimiento

### 1. **CDN para Archivos**
- Usar CloudFront, Cloud CDN, o Azure CDN
- Configurar cache headers apropiados
- Comprimir archivos de audio

### 2. **Optimización de Consultas**
- Crear índices en MongoDB para búsquedas frecuentes
- Usar índices en Neo4j para relaciones
- Implementar cache con Redis

### 3. **Escalabilidad**
- Usar streaming para archivos grandes
- Implementar paginación en listas
- Usar workers para procesamiento asíncrono

## Próximos Pasos

1. **Implementar subida de archivos** con multer o similar
2. **Agregar validación de formatos** de audio
3. **Implementar streaming** de audio
4. **Crear sistema de playlists**
5. **Agregar análisis de audio** (BPM, key, etc.)
6. **Implementar cache** con Redis
7. **Crear dashboard** de administración 