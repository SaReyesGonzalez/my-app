# 🎵 Plataforma de Streaming Musical

Una plataforma completa de streaming musical construida con Next.js, MongoDB, Redis y Neo4j.

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MongoDB       │    │   Neo4j         │    │   Redis         │
│                 │    │                 │    │                 │
│ • Usuarios      │    │ • Relaciones    │    │ • Sesiones      │
│ • Canciones     │    │ • Recomendaciones│   │ • Cache         │
│ • Metadatos     │    │ • Análisis      │    │ • Tokens        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Next.js App   │
                    │                 │
                    │ • API Routes    │
                    │ • Frontend      │
                    │ • Auth          │
                    └─────────────────┘
```

## 🚀 Características

### ✅ Implementado
- **Autenticación completa** con NextAuth.js
- **Gestión de usuarios** en MongoDB
- **Sistema de canciones** con metadatos
- **Reproducción de audio** con reproductor personalizado
- **Recomendaciones inteligentes** con Neo4j
- **Búsqueda de canciones** por título, autor, género
- **Registro de reproducciones** y análisis
- **Interfaz moderna** con Tailwind CSS

### 🔄 En Desarrollo
- Sistema de playlists
- Subida de archivos de audio
- Streaming de audio optimizado
- Análisis de audio (BPM, key, etc.)
- Sistema de favoritos
- Historial de reproducciones

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd my-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env.local`:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/streaming-platform
MONGODB_DB=streaming-platform

# Redis
REDIS_URL=redis://localhost:6379

# Neo4j Aura
NEO4J_URI=neo4j+s://tu-instancia.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=tu-password

# NextAuth
NEXTAUTH_SECRET=tu-secret-muy-seguro
NEXTAUTH_URL=http://localhost:4000
```

### 4. Iniciar bases de datos
```bash
# MongoDB (si usas Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Redis (si usas Docker)
docker run -d -p 6379:6379 --name redis redis:alpine
```

### 5. Ejecutar el proyecto
```bash
npm run dev
```

## 🎵 Uso del Sistema

### 1. Poblar Base de Datos
```bash
# Ejecutar script de población
node scripts/populate-songs.js
```

### 2. Crear Canción
```bash
curl -X POST http://localhost:4000/api/canciones \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Mi Canción",
    "duracion": 240,
    "autorId": "mi-autor",
    "generoId": "pop",
    "fechaLanzamiento": "2024-01-01",
    "urlAudio": "https://ejemplo.com/audio.mp3"
  }'
```

### 3. Buscar Canciones
```bash
# Todas las canciones
curl http://localhost:4000/api/canciones

# Por título
curl "http://localhost:4000/api/canciones?titulo=bohemian"

# Por autor
curl "http://localhost:4000/api/canciones?autorId=queen"
```

### 4. Reproducir Canción
```bash
# Registrar reproducción
curl -X POST http://localhost:4000/api/canciones/CANCION_ID/play

# Obtener información
curl http://localhost:4000/api/canciones/CANCION_ID/play
```

### 5. Obtener Recomendaciones
```bash
# Por usuario
curl "http://localhost:4000/api/neo4j/recommendations?tipo=usuario&usuarioId=123"

# Canciones similares
curl "http://localhost:4000/api/neo4j/recommendations?tipo=similares&cancionId=456"

# Tendencias
curl "http://localhost:4000/api/neo4j/recommendations?tipo=tendencias"
```

## 🎨 Interfaz de Usuario

### Páginas Disponibles
- **`/`** - Página principal
- **`/auth/signin`** - Iniciar sesión
- **`/auth/register`** - Registrarse
- **`/auth/guest`** - Acceso como invitado
- **`/dashboard`** - Panel de usuario
- **`/my-account`** - Mi cuenta
- **`/music`** - Biblioteca de música

### Componentes Principales
- **`AudioPlayer`** - Reproductor de audio personalizado
- **`Form`** - Componente de formulario reutilizable
- **Páginas de autenticación** - Login, registro, invitado

## 🗄️ Estructura de Datos

### MongoDB Collections
```javascript
// usuarios
{
  _id: ObjectId,
  email: String,
  password: String (hasheada),
  nombre: String,
  createdAt: Date,
  updatedAt: Date
}

// canciones
{
  _id: ObjectId,
  titulo: String,
  duracion: Number, // segundos
  autorId: String,
  generoId: String,
  fechaLanzamiento: Date,
  albumId: String,
  letra: String,
  urlAudio: String,
  urlPortada: String,
  reproducciones: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Neo4j Nodes & Relationships
```cypher
// Nodes
(Usuario {id: String, email: String})
(Cancion {id: String, titulo: String, duracion: Number})
(Autor {id: String, nombre: String})
(Genero {id: String, nombre: String})

// Relationships
(Usuario)-[:ESCUCHA {fecha: DateTime}]->(Cancion)
(Autor)-[:CANTA]->(Cancion)
(Cancion)-[:ES_GENERO]->(Genero)
```

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/guest` - Acceso como invitado
- `GET /api/auth/[...nextauth]` - NextAuth endpoints

### Usuarios
- `GET /api/account` - Obtener perfil
- `PUT /api/account` - Actualizar perfil
- `POST /api/account/change-password` - Cambiar contraseña
- `DELETE /api/account` - Eliminar cuenta

### Canciones
- `GET /api/canciones` - Listar/buscar canciones
- `POST /api/canciones` - Crear canción
- `GET /api/canciones/[id]/play` - Obtener info de canción
- `POST /api/canciones/[id]/play` - Registrar reproducción

### Recomendaciones (Neo4j)
- `GET /api/neo4j/recommendations` - Obtener recomendaciones
- `GET /api/neo4j/test` - Probar conexión Neo4j

## 🛠️ Desarrollo

### Scripts Disponibles
```bash
npm run dev          # Desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar en producción
npm run lint         # Linting
```

### Estructura del Proyecto
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Panel de usuario
│   └── music/             # Biblioteca de música
├── components/            # Componentes React
│   ├── audio-player/      # Reproductor de audio
│   └── ui/                # Componentes UI
├── entities/              # Entidades del dominio
├── infrastructure/        # Repositorios y servicios
├── interface-adapters/    # Controladores
├── lib/                   # Utilidades y conexiones DB
└── models/                # Modelos de datos
```

## 📚 Documentación Adicional

- **[NEO4J_SETUP.md](./NEO4J_SETUP.md)** - Configuración y uso de Neo4j
- **[CANCIONES_SETUP.md](./CANCIONES_SETUP.md)** - Sistema de canciones y reproducción

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación en los archivos `.md`
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que las bases de datos estén corriendo
4. Revisa los logs del servidor para errores específicos

## 🎯 Próximos Pasos

- [ ] Implementar subida de archivos de audio
- [ ] Agregar sistema de playlists
- [ ] Implementar streaming optimizado
- [ ] Crear dashboard de administración
- [ ] Agregar análisis de audio
- [ ] Implementar cache con Redis
- [ ] Crear sistema de favoritos
- [ ] Agregar historial de reproducciones
