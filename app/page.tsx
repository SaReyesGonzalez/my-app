'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import ContentCard from '@/components/ui/ContentCard';
import { Contenido } from '@/types/content';

export default function Home() {
  const { data: session } = useSession();
  const [recomendaciones, setRecomendaciones] = useState<Contenido[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarContenidoInicial();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      cargarRecomendaciones();
      cargarFavoritos();
    }
  }, [session]);

  const cargarContenidoInicial = async () => {
    try {
      const response = await fetch('/api/contenido');
      const data = await response.json();
      setRecomendaciones(data);
    } catch (error) {
      console.error('Error cargando contenido:', error);
      setError('Error al cargar el contenido');
    } finally {
      setLoading(false);
    }
  };

  const cargarRecomendaciones = async () => {
    try {
      const response = await fetch('/api/recomendaciones');
      const data = await response.json();
      setRecomendaciones(data);
    } catch (error) {
      console.error('Error cargando recomendaciones:', error);
      setError('Error al cargar las recomendaciones');
    }
  };

  const cargarFavoritos = async () => {
    try {
      const response = await fetch('/api/favoritos');
      if (response.ok) {
        const data = await response.json();
        setFavoritos(data.map((item: Contenido) => item.id));
      }
    } catch (error) {
      console.error('Error cargando favoritos:', error);
      setError('Error al cargar los favoritos');
    }
  };

  const buscarContenido = async () => {
    if (!busqueda.trim()) return;
    
    try {
      const response = await fetch(`/api/buscar?q=${encodeURIComponent(busqueda)}`);
      const data = await response.json();
      setRecomendaciones(data);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setError('Error al buscar el contenido');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">🎵 MusicStream</h1>
            <p className="text-xl text-gray-600 mb-8">
              Descubre, reproduce y guarda tu música favorita
            </p>
            
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/auth/signin" 
                className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors shadow-lg"
              >
                Registrarse
              </Link>
            </div>
          </div>

          {/* Búsqueda */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar canciones, artistas o podcasts..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none shadow-sm bg-white text-purple-800"
              />
              <button
                onClick={buscarContenido}
                className="absolute right-2 top-2 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                🔍
              </button>
            </div>
          </div>
        </div>
        {/* Navegación rápida SIEMPRE visible */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
            <Link href="/rankings" className="bg-white p-6 rounded-lg shadow-sm border border-purple-200 hover:shadow-md transition-shadow text-center hover:bg-purple-50">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rankings</h3>
              <p className="text-gray-700">Descubre las canciones más populares</p>
            </Link>
            <Link href="/generos" className="bg-white p-6 rounded-lg shadow-sm border border-purple-200 hover:shadow-md transition-shadow text-center hover:bg-purple-50">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Géneros</h3>
              <p className="text-gray-700">Explora por género musical</p>
            </Link>
            <Link href="/favoritos" className="bg-white p-6 rounded-lg shadow-sm border border-purple-200 hover:shadow-md transition-shadow text-center hover:bg-purple-50">
              <div className="text-3xl mb-3">❤️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Favoritos</h3>
              <p className="text-gray-700">Tu música guardada</p>
            </Link>
            <Link href="/playlists" className="bg-white p-6 rounded-lg shadow-sm border border-purple-200 hover:shadow-md transition-shadow text-center hover:bg-purple-50">
              <div className="text-3xl mb-3">📂</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Playlists</h3>
              <p className="text-gray-700">Crea y gestiona tus playlists</p>
            </Link>
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
          <h1 className="text-5xl font-bold text-gray-900 mb-4">🎵 MusicStream</h1>
          <p className="text-xl text-gray-700 mb-8">
            Descubre, reproduce y guarda tu música favorita
          </p>
          
          {session?.user ? (
            /* Mensaje de bienvenida para usuarios autenticados */
            <div className="mb-8">
              <p className="text-lg text-purple-700 mb-4">
                ¡Bienvenido de vuelta, {session.user.name || session.user.email}!
              </p>
              <p className="text-gray-600 mb-4">
                Disfruta de tu música personalizada y gestiona tus favoritos
              </p>
              <button
                onClick={() => signOut()}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            /* Botones de acción para usuarios no autenticados */
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/auth/signin" 
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50 transition-colors shadow-lg"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* Búsqueda */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar canciones, artistas o podcasts..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none shadow-sm"
            />
            <button
              onClick={buscarContenido}
              className="absolute right-2 top-2 bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              🔍
            </button>
          </div>
        </div>

        {/* Navegación rápida */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
          <Link 
            href="/rankings" 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
          >
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rankings</h3>
            <p className="text-gray-600">Descubre las canciones más populares</p>
          </Link>
          
          <Link 
            href="/generos" 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
          >
            <div className="text-3xl mb-3">🎵</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Géneros</h3>
            <p className="text-gray-600">Explora por género musical</p>
          </Link>

          {session?.user ? (
            <Link 
              href="/playlists" 
              className="bg-white p-6 rounded-lg shadow-sm border border-purple-400 hover:shadow-md transition-shadow text-center hover:bg-purple-50"
            >
              <div className="text-3xl mb-3">📂</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Playlists</h3>
              <p className="text-gray-700">Crea y gestiona tus playlists</p>
            </Link>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center opacity-60 cursor-not-allowed select-none">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Playlists</h3>
              <p className="text-gray-700">Solo para usuarios registrados</p>
            </div>
          )}

          {session?.user ? (
            /* Opciones para usuarios autenticados */
            <>
              <Link 
                href="/favoritos" 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-3xl mb-3">❤️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Favoritos</h3>
                <p className="text-gray-600">Tu música guardada</p>
              </Link>
              <Link 
                href="/podcasts" 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-3xl mb-3">🎙️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Podcasts</h3>
                <p className="text-gray-600">Explora podcasts por género</p>
              </Link>
            </>
          ) : (
            /* Opciones para usuarios no autenticados */
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl mb-3">🎧</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reproducir</h3>
                <p className="text-gray-600">Escucha música sin registro</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Regístrate</h3>
                <p className="text-gray-600">Para guardar favoritos</p>
              </div>
            </>
          )}
        </div>

        {/* Contenido principal */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {session?.user ? 'Contenido Recomendado para Ti' : 'Contenido Popular'}
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando contenido...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={cargarContenidoInicial}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {recomendaciones.map((item) => (
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

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2024 MusicStream. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}

 