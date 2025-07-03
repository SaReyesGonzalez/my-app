# 🚀 Guía Rápida - Plataforma de Streaming

## 🎯 **¿Cómo Probar el Sistema?**

### **1. Iniciar el Proyecto**
```bash
npm run dev
```
Abre: `http://localhost:4000`

### **2. Poblar con Datos de Ejemplo**
```bash
node scripts/populate-songs.js
```
Esto creará 5 canciones de prueba con archivos de audio reales.

### **3. Navegar a la Biblioteca**
```
http://localhost:4000/music
```

## 🎵 **Opciones para Obtener Archivos de Audio**

### **Opción 1: Archivos de Prueba (Ya Incluidos)**
El script de población incluye URLs a archivos de audio gratuitos:
- ✅ Campanas
- ✅ Buzones de error
- ✅ Sonidos de éxito
- ✅ Timbre de teléfono
- ✅ Timbre de puerta

### **Opción 2: Subir Tus Propios Archivos**
1. Ve a `http://localhost:4000/upload`
2. Selecciona un archivo de audio (MP3, WAV, OGG)
3. Completa la información
4. ¡Listo! La canción estará en la biblioteca

### **Opción 3: Archivos Locales**
Puedes colocar archivos MP3 en:
```
public/uploads/
```
Y usar URLs como: `/uploads/tu-archivo.mp3`

### **Opción 4: URLs Externas**
Usar URLs de servicios como:
- **SoundCloud** (enlaces directos)
- **Dropbox** (enlaces públicos)
- **Google Drive** (enlaces públicos)
- **AWS S3** (si tienes bucket configurado)

## 🎨 **Interfaz Disponible**

### **Páginas Principales:**
- **`/`** - Página principal
- **`/music`** - Biblioteca de música ⭐
- **`/upload`** - Subir canciones ⭐
- **`/auth/signin`** - Iniciar sesión
- **`/auth/register`** - Registrarse
- **`/dashboard`** - Panel de usuario

### **Funcionalidades del Reproductor:**
- ✅ **Play/Pause** con botón central
- ✅ **Barra de progreso** arrastrable
- ✅ **Control de volumen** deslizante
- ✅ **Tiempo actual/total** en mm:ss
- ✅ **Registro automático** de reproducciones
- ✅ **Interfaz responsive** para móviles

## 🔧 **Comandos Útiles**

### **Ver Todas las Canciones:**
```bash
curl http://localhost:4000/api/canciones
```

### **Buscar por Título:**
```bash
curl "http://localhost:4000/api/canciones?titulo=sample"
```

### **Reproducir Canción:**
```bash
curl -X POST http://localhost:4000/api/canciones/CANCION_ID/play
```

### **Ver Recomendaciones:**
```bash
curl "http://localhost:4000/api/neo4j/recommendations?tipo=tendencias"
```

## 📁 **Estructura de Archivos**

```
public/
├── uploads/          # Archivos subidos por usuarios
└── ...               # Archivos estáticos

src/
├── app/
│   ├── api/          # Endpoints de la API
│   ├── music/        # Biblioteca de música
│   └── upload/       # Página de subida
├── components/
│   └── audio-player/ # Reproductor personalizado
└── ...
```

## 🎯 **Flujo de Uso Típico**

1. **Iniciar servidor** → `npm run dev`
2. **Poblar datos** → `node scripts/populate-songs.js`
3. **Abrir biblioteca** → `http://localhost:4000/music`
4. **Reproducir canciones** → Clic en cualquier canción
5. **Subir nuevas** → Botón "Subir Nueva Canción"
6. **Buscar** → Usar el buscador por título

## 🔍 **Solución de Problemas**

### **No se reproducen las canciones:**
- Verifica que las URLs de audio sean accesibles
- Revisa la consola del navegador para errores
- Asegúrate de que el archivo sea un formato válido

### **Error al subir archivos:**
- Verifica que el archivo sea menor a 50MB
- Asegúrate de que sea un formato de audio válido
- Revisa que la carpeta `public/uploads/` tenga permisos de escritura

### **No aparecen las canciones:**
- Ejecuta el script de población
- Verifica que MongoDB esté corriendo
- Revisa los logs del servidor

## 🎉 **¡Listo para Usar!**

El sistema está completamente funcional con:
- ✅ Interfaz gráfica moderna
- ✅ Reproductor de audio personalizado
- ✅ Sistema de subida de archivos
- ✅ Búsqueda de canciones
- ✅ Registro de reproducciones
- ✅ Recomendaciones con Neo4j

**¡Disfruta tu plataforma de streaming!** 🎵 