import { NextResponse } from 'next/server';
import { CancionRepositoryNeo4j } from '@/infrastructure/repositories/CancionRepositoryNeo4j';

const cancionRepo = new CancionRepositoryNeo4j();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const usuarioId = searchParams.get('usuarioId');
    const generoId = searchParams.get('generoId');
    const cancionId = searchParams.get('cancionId');
    const limite = parseInt(searchParams.get('limite') || '10');

    switch (tipo) {
      case 'usuario':
        if (!usuarioId) {
          return NextResponse.json(
            { error: 'Se requiere usuarioId para recomendaciones por usuario' },
            { status: 400 }
          );
        }
        const recomendacionesUsuario = await cancionRepo.obtenerRecomendacionesPorUsuario(usuarioId, limite);
        return NextResponse.json({
          tipo: 'recomendaciones_usuario',
          canciones: recomendacionesUsuario.map(c => ({
            id: c.getId(),
            titulo: c.getTitulo(),
            duracion: c.getDuracion()
          }))
        });

      case 'genero':
        if (!generoId) {
          return NextResponse.json(
            { error: 'Se requiere generoId para recomendaciones por género' },
            { status: 400 }
          );
        }
        const recomendacionesGenero = await cancionRepo.obtenerRecomendacionesPorGenero(generoId, limite);
        return NextResponse.json({
          tipo: 'recomendaciones_genero',
          canciones: recomendacionesGenero.map(c => ({
            id: c.getId(),
            titulo: c.getTitulo(),
            duracion: c.getDuracion()
          }))
        });

      case 'similares':
        if (!cancionId) {
          return NextResponse.json(
            { error: 'Se requiere cancionId para canciones similares' },
            { status: 400 }
          );
        }
        const cancionesSimilares = await cancionRepo.obtenerCancionesSimilares(cancionId, limite);
        return NextResponse.json({
          tipo: 'canciones_similares',
          canciones: cancionesSimilares.map(c => ({
            id: c.getId(),
            titulo: c.getTitulo(),
            duracion: c.getDuracion()
          }))
        });

      case 'autores':
        if (!usuarioId) {
          return NextResponse.json(
            { error: 'Se requiere usuarioId para autores recomendados' },
            { status: 400 }
          );
        }
        const autoresRecomendados = await cancionRepo.obtenerAutoresRecomendados(usuarioId, limite);
        return NextResponse.json({
          tipo: 'autores_recomendados',
          autores: autoresRecomendados.map(a => ({
            id: a.getId(),
            nombre: a.getNombre(),
            biografia: a.getBiografia()
          }))
        });

      case 'tendencias':
        const tendencias = await cancionRepo.obtenerTendencias(limite);
        return NextResponse.json({
          tipo: 'tendencias',
          canciones: tendencias.map(c => ({
            id: c.getId(),
            titulo: c.getTitulo(),
            duracion: c.getDuracion()
          }))
        });

      case 'usuarios_similares':
        if (!usuarioId) {
          return NextResponse.json(
            { error: 'Se requiere usuarioId para usuarios con gustos similares' },
            { status: 400 }
          );
        }
        const usuariosSimilares = await cancionRepo.obtenerUsuariosConGustosSimilares(usuarioId, limite);
        return NextResponse.json({
          tipo: 'usuarios_similares',
          usuarios: usuariosSimilares
        });

      default:
        return NextResponse.json(
          { error: 'Tipo de recomendación no válido. Opciones: usuario, genero, similares, autores, tendencias, usuarios_similares' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error al obtener recomendaciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener recomendaciones' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { usuarioId, cancionId } = await request.json();

    if (!usuarioId || !cancionId) {
      return NextResponse.json(
        { error: 'Se requieren usuarioId y cancionId' },
        { status: 400 }
      );
    }

    await cancionRepo.registrarReproduccion(usuarioId, cancionId);

    return NextResponse.json({
      message: 'Reproducción registrada exitosamente'
    });

  } catch (error: any) {
    console.error('Error al registrar reproducción:', error);
    return NextResponse.json(
      { error: 'Error al registrar reproducción' },
      { status: 500 }
    );
  }
} 