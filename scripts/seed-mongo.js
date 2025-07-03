const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/app';
const client = new MongoClient(uri);

async function seed() {
  await client.connect();
  const db = client.db();

  // Usuarios de ejemplo
  await db.collection('usuarios').insertMany([
    { nombre: 'Juan', email: 'juan@correo.com', tipo: 'registrado' },
    { nombre: 'Ana', email: 'ana@correo.com', tipo: 'registrado' },
    { nombre: 'Invitado', tipo: 'invitado' }
  ]);

  // Canciones de ejemplo
  await db.collection('canciones').insertMany([
    { titulo: 'Canción 1', artista: 'Artista 1', genero: 'Pop', tipo: 'musica' },
    { titulo: 'Canción 2', artista: 'Artista 2', genero: 'Rock', tipo: 'musica' },
    { titulo: 'Podcast 1', artista: 'Podcaster 1', genero: 'Educativo', tipo: 'podcast' }
  ]);

  // Playlists de ejemplo
  await db.collection('playlists').insertMany([
    { nombre: 'Favoritos de Juan', usuario: 'Juan', canciones: ['Canción 1', 'Podcast 1'] },
    { nombre: 'Rock de Ana', usuario: 'Ana', canciones: ['Canción 2'] }
  ]);

  // Favoritos de ejemplo
  await db.collection('favoritos').insertMany([
    { usuario: 'Juan', contenido: 'Canción 1' },
    { usuario: 'Ana', contenido: 'Canción 2' }
  ]);

  // Historial de reproducciones de ejemplo
  await db.collection('historial').insertMany([
    { usuario: 'Juan', contenido: 'Canción 1', fecha: new Date() },
    { usuario: 'Ana', contenido: 'Podcast 1', fecha: new Date() }
  ]);

  console.log('Datos de prueba insertados en MongoDB');
  await client.close();
}

seed(); 