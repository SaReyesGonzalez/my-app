import { NextResponse } from 'next/server';
import { ContentService } from '../../../services/contentService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genero = searchParams.get('genero');
    const tipo = searchParams.get('tipo'); // 'cancion' o 'podcast'
    
    const contenido = await ContentService.obtenerContenido();
    
    // Filtrar por tipo si se especifica
    let contenidoFiltrado = contenido;
    if (tipo && tipo !== 'todos') {
      contenidoFiltrado = contenidoFiltrado.filter(item => 
        item.tipo.toLowerCase() === tipo.toLowerCase()
      );
    }
    // Filtrar por género si se especifica
    if (genero && genero !== 'todos') {
      contenidoFiltrado = contenidoFiltrado.filter(item => 
        item.genero.toLowerCase() === genero.toLowerCase()
      );
    }
    
    // Agregar contadores de reproducciones simulados
    const contadoresSimulados: { [key: string]: number } = {
      "1": 11560, "2": 9870, "4": 7650, "6": 7120, "7": 15420,
      "8": 12850, "9": 8230, "11": 10230, "12": 8950, "13": 6890,
      "14": 5670, "15": 4890, "16": 4230, "17": 3980, "18": 3560,
      "19": 12340, "20": 8760, "21": 6540, "22": 9870, "23": 5430,
      "24": 7890, "25": 4320, "26": 5670, "27": 3450, "28": 6780,
      "29": 8900, "30": 12300, "31": 14500, "32": 11200
    };
    
    const contenidoConContadores = contenidoFiltrado.map(item => ({
      ...item,
      reproducciones: contadoresSimulados[item.id] || Math.floor(Math.random() * 5000) + 1000
    }));
    
    return NextResponse.json(contenidoConContadores);
  } catch (error) {
    console.error('Error obteniendo contenido:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 