// Script para poblar la base de datos con canciones de ejemplo
// Ejecutar con: node scripts/populate-songs.js

const cancionesEjemplo = [
  {
    titulo: "Sample Audio 1",
    duracion: 30, // 30 segundos
    autorId: "sample-artist",
    generoId: "electronic",
    fechaLanzamiento: new Date("2024-01-01"),
    urlAudio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    urlPortada: "https://picsum.photos/300/300?random=1"
  },
  {
    titulo: "Sample Audio 2",
    duracion: 45, // 45 segundos
    autorId: "test-artist",
    generoId: "ambient",
    fechaLanzamiento: new Date("2024-01-02"),
    urlAudio: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav",
    urlPortada: "https://picsum.photos/300/300?random=2"
  },
  {
    titulo: "Sample Audio 3",
    duracion: 60, // 1 minuto
    autorId: "demo-artist",
    generoId: "jazz",
    fechaLanzamiento: new Date("2024-01-03"),
    albumId: "demo-album",
    letra: "Demo audio file for testing the player",
    urlAudio: "https://www.soundjay.com/misc/sounds/success-1.wav",
    urlPortada: "https://picsum.photos/300/300?random=3"
  },
  {
    titulo: "Sample Audio 4",
    duracion: 25, // 25 segundos
    autorId: "sample-musician",
    generoId: "classical",
    fechaLanzamiento: new Date("2024-01-04"),
    albumId: "sample-collection",
    letra: "Classical sample audio for testing",
    urlAudio: "https://www.soundjay.com/misc/sounds/phone-ring-1.wav",
    urlPortada: "https://picsum.photos/300/300?random=4"
  },
  {
    titulo: "Sample Audio 5",
    duracion: 35, // 35 segundos
    autorId: "test-musician",
    generoId: "folk",
    fechaLanzamiento: new Date("2024-01-05"),
    albumId: "test-collection",
    letra: "Folk sample audio for testing",
    urlAudio: "https://www.soundjay.com/misc/sounds/doorbell-1.wav",
    urlPortada: "https://picsum.photos/300/300?random=5"
  },

];

// Función para crear canciones usando la API
async function crearCanciones() {
  console.log('🌱 Poblando base de datos con canciones de ejemplo...');
  
  for (const cancion of cancionesEjemplo) {
    try {
      const response = await fetch('http://localhost:4000/api/canciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cancion)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Creada: ${cancion.titulo} (ID: ${result.cancionId})`);
      } else {
        const error = await response.json();
        console.log(`❌ Error al crear ${cancion.titulo}:`, error.error);
      }
    } catch (error) {
      console.log(`❌ Error de red al crear ${cancion.titulo}:`, error.message);
    }
  }
  
  console.log('🎵 Proceso de población completado!');
}

// Ejecutar el script
if (require.main === module) {
  crearCanciones();
}

module.exports = { crearCanciones, cancionesEjemplo }; 