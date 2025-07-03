'use client';

import { useState, useEffect } from 'react';
import AudioPlayer from '@/components/audio-player/AudioPlayer';

interface Cancion {
  id: string;
  titulo: string;
  duracion: number;
  autorId: string;
  generoId: string;
  fechaLanzamiento: string;
  albumId?: string;
  letra?: string;
  urlAudio: string;
  urlPortada?: string;
  reproducciones: number;
  createdAt: string;
  updatedAt: string;
}

export default function MusicPage() {
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [cancionSeleccionada, setCancionSeleccionada] = useState<Cancion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar canciones
  useEffect(() => {
    cargarCanciones();
  }, []);

  const cargarCanciones = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/canciones');
      if (!response.ok) {
        throw new Error('Error al cargar canciones');
      }
      const data = await response.json();
      setCanciones(data.canciones);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const buscarCanciones = async () => {
    if (!searchTerm.trim()) {
      cargarCanciones();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/canciones?titulo=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Error al buscar canciones');
      }
      const data = await response.json();
      setCanciones(data.canciones);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const formatearDuracion = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando canciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={cargarCanciones}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎵 Biblioteca de Música
          </h1>
          <p className="text-gray-600">
            Descubre y reproduce tu música favorita
          </p>
        </div>

        {/* Buscador y Botón de Subida */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Buscar canciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && buscarCanciones()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={buscarCanciones}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Buscar
            </button>
          </div>
          
          {/* Botón para subir canciones */}
          <div className="text-center">
            <button
              onClick={() => window.location.href = '/upload'}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Subir Nueva Canción
            </button>
          </div>
        </div>

        {/* Reproductor */}
        {cancionSeleccionada && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              🎧 Reproduciendo
            </h2>
            <AudioPlayer
              cancion={cancionSeleccionada}
              onEnd={() => setCancionSeleccionada(null)}
            />
          </div>
        )}

        {/* Lista de canciones */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            📚 Canciones Disponibles ({canciones.length})
          </h2>
          
          {canciones.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎵</div>
              <p className="text-gray-600 text-lg">
                {searchTerm ? 'No se encontraron canciones con ese título' : 'No hay canciones disponibles'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    cargarCanciones();
                  }}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Ver todas las canciones
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {canciones.map((cancion) => (
                <div
                  key={cancion.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setCancionSeleccionada(cancion)}
                >
                  {/* Portada */}
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {cancion.urlPortada ? (
                      <img
                        src={cancion.urlPortada}
                        alt={cancion.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-4xl">🎵</div>
                    )}
                  </div>

                  {/* Información */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                      {cancion.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Autor: {cancion.autorId}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>🎵 {formatearDuracion(cancion.duracion)}</span>
                      <span>👥 {cancion.reproducciones} reproducciones</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      📅 {formatearFecha(cancion.fechaLanzamiento)}
                    </div>
                  </div>

                  {/* Botón de reproducción */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCancionSeleccionada(cancion);
                      }}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Reproducir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            💡 <strong>Consejo:</strong> Haz clic en cualquier canción para reproducirla en el reproductor superior
          </p>
          <p className="mt-2">
            🔍 Usa el buscador para encontrar canciones específicas por título
          </p>
        </div>
      </div>
    </div>
  );
} 