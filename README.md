# 🎵 Plataforma de Streaming Musical

Una aplicación moderna de streaming musical construida con Next.js 15, TypeScript y Tailwind CSS.

## 🚀 Características

- **Autenticación**: Sistema completo de registro e inicio de sesión con NextAuth v5
- **Contenido Musical**: Canciones y podcasts con imágenes relacionadas a los artistas
- **Recomendaciones Personalizadas**: Sistema de recomendaciones basado en preferencias
- **Favoritos**: Gestión de contenido favorito por usuario
- **Búsqueda**: Búsqueda en tiempo real por título, artista o género
- **Reproducción**: Sistema de reproducción con historial
- **Diseño Responsivo**: Interfaz moderna y adaptable a todos los dispositivos

## 🏗️ Arquitectura

### Estructura de Carpetas

```
my-app/
├── app/                    # App Router de Next.js 15
│   ├── api/               # Rutas API
│   ├── auth/              # Páginas de autenticación
│   ├── favoritos/         # Página de favoritos
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizables
│   └── ui/               # Componentes de UI
├── hooks/                # Hooks personalizados
├── services/             # Servicios de negocio
├── types/                # Tipos TypeScript
├── lib/                  # Utilidades y configuraciones
└── src/                  # Código fuente principal
    ├── application/      # Casos de uso
    ├── entities/         # Entidades de dominio
    ├── infrastructure/   # Implementaciones técnicas
    └── interface-adapters/ # Controladores y presentación
```

### Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Autenticación**: NextAuth v5
- **Base de Datos**: MongoDB, Redis, Neo4j
- **Estado**: React Hooks, Context API

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local` con tus configuraciones:
   ```env
   NEXTAUTH_SECRET=tu-secret-aqui
   MONGODB_URI=tu-mongodb-uri
   REDIS_URL=tu-redis-url
   NEO4J_URI=tu-neo4j-uri
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:4000
   ```

## 📱 Uso

### Como Usuario Invitado
- Explorar contenido musical y podcasts
- Buscar por título, artista o género
- Ver recomendaciones generales

### Como Usuario Registrado
- Todas las funcionalidades de invitado
- Gestionar favoritos
- Ver recomendaciones personalizadas
- Historial de reproducciones

### Credenciales Demo
- **Email**: demo@example.com
- **Contraseña**: demo123

## 🔧 Desarrollo

### Comandos Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Verificar código
npm run type-check   # Verificar tipos TypeScript
```

### Estructura de Datos

#### Contenido
```typescript
interface Contenido {
  id: string;
  titulo: string;
  tipo: 'cancion' | 'podcast';
  autor: string;
  genero: string;
  duracion: string;
  urlImagen: string;
}
```

#### Usuario
```typescript
interface Usuario {
  id: string;
  email: string;
  nombre: string;
  favoritos: string[];
  historial: string[];
}
```

### Patrones de Diseño

- **Clean Architecture**: Separación clara de responsabilidades
- **Repository Pattern**: Abstracción de acceso a datos
- **Service Layer**: Lógica de negocio centralizada
- **Custom Hooks**: Reutilización de lógica de estado
- **Component Composition**: Componentes modulares y reutilizables

## 🎨 Personalización

### Agregar Nuevo Contenido

1. Editar `services/contentService.ts`
2. Agregar datos al array `contenidoPrueba`
3. Las imágenes se cargan automáticamente

### Modificar Estilos

- Los estilos están en `app/globals.css`
- Componentes usan Tailwind CSS
- Temas personalizables en `tailwind.config.js`

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Otros Proveedores
- Netlify
- Railway
- Heroku
- AWS Amplify

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisar la documentación
2. Buscar en issues existentes
3. Crear nuevo issue con detalles del problema

## 🔮 Roadmap

- [ ] Reproductor de audio real
- [ ] Playlists personalizadas
- [ ] Compartir contenido
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Integración con APIs de música reales
- [ ] Sistema de comentarios
- [ ] Recomendaciones con IA

---

¡Disfruta explorando la música! 🎶
