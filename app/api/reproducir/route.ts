import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contenidoId } = body;

    if (!contenidoId) {
      return NextResponse.json(
        { error: 'ID de contenido requerido' },
        { status: 400 }
      );
    }

    // Simular registro de reproducción y actualización de contador
    console.log(`Reproducción registrada para contenido: ${contenidoId}`);
    
    // Simular contador de reproducciones (en producción esto vendría de Redis)
    const contadoresSimulados: { [key: string]: number } = {
      "1": 11560,
      "2": 9870,
      "4": 7650,
      "6": 7120,
      "7": 15420,
      "8": 12850,
      "9": 8230,
      "11": 10230,
      "12": 8950,
      "13": 6890,
      "14": 5670,
      "15": 4890,
      "17": 4230,
      "18": 3980
    };
    
    const contadorActual = contadoresSimulados[contenidoId] || 0;
    const nuevoContador = contadorActual + 1;
    
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({ 
      success: true, 
      message: 'Reproducción registrada correctamente',
      contenidoId,
      contador: nuevoContador
    });
  } catch (error) {
    console.error('Error registrando reproducción:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 