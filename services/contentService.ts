import { Contenido } from '../types/content';

// Datos de prueba centralizados
const contenidoPrueba: Contenido[] = [
  {
    id: "1",
    titulo: "Bohemian Rhapsody",
    tipo: "cancion",
    autor: "Queen",
    genero: "Rock",
    duracion: "5:55",
    urlImagen: "https://www.queenonline.com/global/uploads/NATO-7-010.jpg",
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "2",
    titulo: "Imagine",
    tipo: "cancion",
    autor: "John Lennon",
    genero: "Rock",
    duracion: "3:03",
    urlImagen: "https://cdn-images.dzcdn.net/images/cover/2675a9277dfabb74c32b7a3b2c9b0170/0x1900-000000-80-0-0.jpg",
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "3",
    titulo: "Episodio 1: Introducción al Desarrollo Web",
    tipo: "podcast",
    autor: "Tech Podcast",
    genero: "Tecnología",
    duracion: "45:30",
    urlImagen: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "4",
    titulo: "Hotel California",
    tipo: "cancion",
    autor: "Eagles",
    genero: "Rock",
    duracion: "6:30",
    urlImagen: "https://needle.cl/cdn/shop/files/OTEtODE5MS5qcGVn.jpg?v=1726150902",
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "5",
    titulo: "Episodio 2: JavaScript Moderno",
    tipo: "podcast",
    autor: "Code Masters",
    genero: "Programación",
    duracion: "52:15",
    urlImagen: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "6",
    titulo: "Stairway to Heaven",
    tipo: "cancion",
    autor: "Led Zeppelin",
    genero: "Rock",
    duracion: "8:02",
    urlImagen: "https://robertopatxot.wordpress.com/wp-content/uploads/2021/07/escalera.jpeg",
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "7",
    titulo: "Dynamite",
    tipo: "cancion",
    autor: "BTS",
    genero: "K-pop",
    duracion: "3:19",
    urlImagen: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=center",
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: "8",
    titulo: "How You Like That",
    tipo: "cancion",
    autor: "BLACKPINK",
    genero: "K-pop",
    duracion: "3:01",
    urlImagen: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "9",
    titulo: "Fancy",
    tipo: "cancion",
    autor: "TWICE",
    genero: "K-pop",
    duracion: "3:35",
    urlImagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "10",
    titulo: "Episodio 3: React vs Vue",
    tipo: "podcast",
    autor: "Frontend Masters",
    genero: "Programación",
    duracion: "48:20",
    urlImagen: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "11",
    titulo: "Butter",
    tipo: "cancion",
    autor: "BTS",
    genero: "K-pop",
    duracion: "2:42",
    urlImagen: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "12",
    titulo: "Kill This Love",
    tipo: "cancion",
    autor: "BLACKPINK",
    genero: "K-pop",
    duracion: "3:11",
    urlImagen: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "13",
    titulo: "Episodio 4: Inteligencia Artificial",
    tipo: "podcast",
    autor: "AI Insights",
    genero: "Tecnología",
    duracion: "38:45",
    urlImagen: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "14",
    titulo: "Episodio 5: Python para Principiantes",
    tipo: "podcast",
    autor: "Python Masters",
    genero: "Programación",
    duracion: "55:20",
    urlImagen: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "15",
    titulo: "Episodio 6: Historia del K-pop",
    tipo: "podcast",
    autor: "K-Culture Podcast",
    genero: "Cultura",
    duracion: "42:15",
    urlImagen: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "16",
    titulo: "Episodio 7: Música y Sociedad",
    tipo: "podcast",
    autor: "Cultural Insights",
    genero: "Cultura",
    duracion: "47:30",
    urlImagen: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "17",
    titulo: "Sweet Child O' Mine",
    tipo: "cancion",
    autor: "Guns N' Roses",
    genero: "Rock",
    duracion: "5:56",
    urlImagen: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "18",
    titulo: "Episodio 8: Blockchain y Criptomonedas",
    tipo: "podcast",
    autor: "Crypto Tech",
    genero: "Tecnología",
    duracion: "51:10",
    urlImagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "19",
    titulo: "Billie Jean",
    tipo: "cancion",
    autor: "Michael Jackson",
    genero: "Pop",
    duracion: "4:54",
    urlImagen: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=center",
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: "20",
    titulo: "Like a Rolling Stone",
    tipo: "cancion",
    autor: "Bob Dylan",
    genero: "Rock",
    duracion: "6:13",
    urlImagen: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "21",
    titulo: "Super Bass",
    tipo: "cancion",
    autor: "Nicki Minaj",
    genero: "Hip Hop",
    duracion: "3:20",
    urlImagen: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&crop=center",
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  {
    id: "22",
    titulo: "Lose Yourself",
    tipo: "cancion",
    autor: "Eminem",
    genero: "Hip Hop",
    duracion: "5:26",
    urlImagen: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "23",
    titulo: "Sandstorm",
    tipo: "cancion",
    autor: "Darude",
    genero: "Electrónica",
    duracion: "3:45",
    urlImagen: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop&crop=center",
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  {
    id: "24",
    titulo: "Levels",
    tipo: "cancion",
    autor: "Avicii",
    genero: "Electrónica",
    duracion: "5:34",
    urlImagen: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "25",
    titulo: "Take Five",
    tipo: "cancion",
    autor: "Dave Brubeck",
    genero: "Jazz",
    duracion: "5:24",
    urlImagen: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop&crop=center",
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
  },
  {
    id: "26",
    titulo: "So What",
    tipo: "cancion",
    autor: "Miles Davis",
    genero: "Jazz",
    duracion: "9:22",
    urlImagen: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "27",
    titulo: "Moonlight Sonata",
    tipo: "cancion",
    autor: "Beethoven",
    genero: "Clásica",
    duracion: "14:33",
    urlImagen: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop&crop=center",
    urlAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
  },
  {
    id: "28",
    titulo: "Symphony No. 5",
    tipo: "cancion",
    autor: "Beethoven",
    genero: "Clásica",
    duracion: "33:00",
    urlImagen: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "29",
    titulo: "Gasolina",
    tipo: "cancion",
    autor: "Daddy Yankee",
    genero: "Reggaeton",
    duracion: "3:12",
    urlImagen: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "30",
    titulo: "Despacito",
    tipo: "cancion",
    autor: "Luis Fonsi",
    genero: "Reggaeton",
    duracion: "4:41",
    urlImagen: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "31",
    titulo: "Shape of You",
    tipo: "cancion",
    autor: "Ed Sheeran",
    genero: "Pop",
    duracion: "3:53",
    urlImagen: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=center"
  },
  {
    id: "32",
    titulo: "Uptown Funk",
    tipo: "cancion",
    autor: "Mark Ronson ft. Bruno Mars",
    genero: "Pop",
    duracion: "3:55",
    urlImagen: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=center"
  }
];

export class ContentService {
  static async obtenerContenido(): Promise<Contenido[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    return contenidoPrueba;
  }

  static async buscarContenido(query: string): Promise<Contenido[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query) {
      return contenidoPrueba;
    }

    return contenidoPrueba.filter(item => 
      item.titulo.toLowerCase().includes(query.toLowerCase()) ||
      item.autor.toLowerCase().includes(query.toLowerCase()) ||
      item.genero.toLowerCase().includes(query.toLowerCase())
    );
  }

  static async obtenerRecomendaciones(): Promise<Contenido[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Simular recomendaciones personalizadas
    const recomendaciones: Contenido[] = [
      {
        id: "13",
        titulo: "Spring Day",
        tipo: "cancion",
        autor: "BTS",
        genero: "K-pop",
        duracion: "4:18",
        urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
      },
      {
        id: "14",
        titulo: "DDU-DU DDU-DU",
        tipo: "cancion",
        autor: "BLACKPINK",
        genero: "K-pop",
        duracion: "3:31",
        urlImagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center"
      },
      {
        id: "15",
        titulo: "Feel Special",
        tipo: "cancion",
        autor: "TWICE",
        genero: "K-pop",
        duracion: "3:26",
        urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
      },
      {
        id: "16",
        titulo: "Episodio 4: K-pop y Cultura Coreana",
        tipo: "podcast",
        autor: "K-Culture Podcast",
        genero: "Cultura",
        duracion: "42:15",
        urlImagen: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center"
      },
      {
        id: "17",
        titulo: "Boy With Luv",
        tipo: "cancion",
        autor: "BTS",
        genero: "K-pop",
        duracion: "3:19",
        urlImagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center"
      },
      {
        id: "18",
        titulo: "As If It's Your Last",
        tipo: "cancion",
        autor: "BLACKPINK",
        genero: "K-pop",
        duracion: "3:33",
        urlImagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center"
      }
    ];
    
    return recomendaciones;
  }
} 