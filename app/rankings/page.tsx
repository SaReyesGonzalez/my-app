'use client';

import { useState } from 'react';
import { useRankings } from '../../hooks/useRankings';
import RankingCard from '../../components/ui/RankingCard';
import Link from 'next/link';

export default function RankingsPage() {
  const {
    rankings,
    categoria,
    categorias,
    loading,
    error,
    total,
    actualizado,
    cambiarCategoria,
    refrescarRanking
  } = useRankings();

  const [favoritos, setFavoritos] = useState<string[]>([]);

  const handlePlay = async (id: string) => {
    try {
      const response = await fetch('/api/reproducir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contenidoId: id }),
      });

      if (response.ok) {
        console.log(`Reproducción registrada para contenido: ${id}`);
        // Aquí podrías actualizar el contador de reproducciones en tiempo real
      }
    } catch (error) {
      console.error('Error registrando reproducción:', error);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const isFavorite = favoritos.includes(id);
      const method = isFavorite ? 'DELETE' : 'POST';
      
      const response = await fetch('/api/favoritos', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contenidoId: id }),
      });

      if (response.ok) {
        if (isFavorite) {
          setFavoritos(favoritos.filter(favId => favId !== id));
        } else {
          setFavoritos([...favoritos, id]);
        }
      }
    } catch (error) {
      console.error('Error gestionando favoritos:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-900 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Cargando rankings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-900">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="mb-4">{error}</p>
            <button
              onClick={refrescarRanking}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Botón para volver al inicio */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition-colors">
            <span className="mr-2">←</span> Volver al inicio
          </Link>
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Rankings de Música</h1>
          <p className="text-gray-700 mb-4">
            Descubre las canciones más populares y tendencias actuales
          </p>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <span className="mr-2">📊</span>
            <span>Actualizado: {formatDate(actualizado)}</span>
            <button
              onClick={refrescarRanking}
              className="ml-4 text-gray-800 hover:text-gray-600 transition-colors"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Filtros de categorías */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => cambiarCategoria(cat.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                categoria === cat.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-purple-700 border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Estadísticas */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-gray-900">
            <div>
              <div className="text-2xl font-bold">{total}</div>
              <div className="text-sm text-gray-700">Canciones en ranking</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {rankings.reduce((sum, item) => sum + item.reproducciones, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-700">Reproducciones totales</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.round(rankings.reduce((sum, item) => sum + item.reproducciones, 0) / total).toLocaleString()}
              </div>
              <div className="text-sm text-gray-700">Promedio por canción</div>
            </div>
          </div>
        </div>

        {/* Grid de rankings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {rankings.map((item) => (
            <RankingCard
              key={item.id}
              item={item}
              onPlay={handlePlay}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favoritos.includes(item.id)}
            />
          ))}
        </div>

        {/* Mensaje si no hay rankings */}
        {rankings.length === 0 && (
          <div className="text-center text-gray-900 py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold mb-2">No hay rankings disponibles</h3>
            <p className="text-gray-700">Intenta con otra categoría o vuelve más tarde</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600 text-sm">
          <p>Los rankings se actualizan automáticamente cada hora</p>
          <p className="mt-1">Basado en reproducciones reales de usuarios</p>
        </div>
      </div>
    </div>
  );
} 