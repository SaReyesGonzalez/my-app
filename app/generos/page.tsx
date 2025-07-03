'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ContentCard from '@/components/ui/ContentCard';
import { Contenido } from '@/types/content';

interface Genero {
  id: string;
  nombre: string;
  icono: string;
  color: string;
}

export default function GenerosPage() {
  const { data: session } = useSession();
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [contenido, setContenido] = useState<Contenido[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [generoSeleccionado, setGeneroSeleccionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarGeneros();
    cargarFavoritos();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      cargarFavoritos();
    }
  }, [session]);

  useEffect(() => {
    cargarFavoritos();
  }, [cargarFavoritos]);

  const cargarGeneros = async () => {
    try {
      const response = await fetch('/api/generos');
      const data = await response.json();
      setGeneros(data);
    } catch (error) {
      console.error('Error cargando géneros:', error);
      setError('Error al cargar los géneros');
    } finally {
      setLoading(false);
    }
  };

  const cargarFavoritos = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch('/api/favoritos');
      if (response.ok) {
        const data = await response.json();
        setFavoritos(data.map((item: Contenido) => item.id));
      }
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    }
  };

  const seleccionarGenero = async (generoId: string) => {
    setGeneroSeleccionado(generoId);
    setLoading(true);
    
    try {
      const url = generoId === 'todos' 
        ? '/api/contenido?tipo=cancion' 
        : `/api/contenido?tipo=cancion&genero=${encodeURIComponent(generoId)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setContenido(data);
    } catch (error) {
      console.error('Error cargando contenido del género:', error);
      setError('Error al cargar el contenido del género');
    } finally {
      setLoading(false);
    }
  };

  const reproducirContenido = async (contenidoId: string) => {
    try {
      await fetch('/api/reproducir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenidoId })
      });
    } catch (error) {
      console.error('Error registrando reproducción:', error);
      setError('Error al reproducir el contenido');
    }
  };

  const agregarFavorito = async (contenidoId: string) => {
    if (!session?.user?.id) {
      alert('Debes iniciar sesión para agregar favoritos');
      return;
    }

    try {
      const response = await fetch('/api/favoritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenidoId })
      });
      
      if (response.ok) {
        setFavoritos(prev => [...prev, contenidoId]);
        alert('Agregado a favoritos');
      }
    } catch (error) {
      console.error('Error agregando favorito:', error);
      setError('Error al agregar el favorito');
    }
  };

  if (loading && !generoSeleccionado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Cargando géneros...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4 transition-colors"
          >
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎵 Explorar por Géneros</h1>
          <p className="text-xl text-gray-700">
            Descubre música y podcasts por tu género favorito
          </p>
        </div>

        {/* Grid de géneros */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Géneros Disponibles</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Botón "Todos los géneros" */}
            <button
              onClick={() => seleccionarGenero('todos')}
              className={`p-6 rounded-lg shadow-sm border-2 transition-all duration-300 hover:shadow-md hover:scale-105 text-center ${
                generoSeleccionado === 'todos'
                  ? 'border-purple-500 bg-purple-100'
                  : 'border-purple-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="text-3xl mb-3">🎼</div>
              <h3 className="font-semibold text-gray-900">Todos</h3>
              <p className="text-sm text-gray-600">Ver todo el contenido</p>
            </button>

            {/* Géneros individuales */}
            {generos.map((genero) => (
              <button
                key={genero.id}
                onClick={() => seleccionarGenero(genero.id)}
                className={`p-6 rounded-lg shadow-sm border-2 transition-all duration-300 hover:shadow-md hover:scale-105 text-center ${
                  generoSeleccionado === genero.id
                    ? 'border-purple-500 bg-purple-100'
                    : 'border-purple-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-3">{genero.icono}</div>
                <h3 className="font-semibold text-gray-900">{genero.nombre}</h3>
                <p className="text-sm text-gray-600">Explorar</p>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido del género seleccionado */}
        {generoSeleccionado && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {generoSeleccionado === 'todos' 
                  ? 'Todo el Contenido' 
                  : `Contenido de ${generos.find(g => g.id === generoSeleccionado)?.nombre}`
                }
              </h2>
              <button
                onClick={() => setGeneroSeleccionado(null)}
                className="text-purple-600 hover:text-purple-700 transition-colors"
              >
                Limpiar filtro
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-700">Cargando contenido...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => seleccionarGenero(generoSeleccionado)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : contenido.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No hay contenido disponible para este género.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {contenido.map((item) => (
                  <ContentCard
                    key={item.id}
                    contenido={item}
                    isFavorite={favoritos.includes(item.id)}
                    onPlay={reproducirContenido}
                    onToggleFavorite={agregarFavorito}
                    showFavoriteButton={!!session?.user?.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2024 MusicStream. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
} 