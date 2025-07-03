'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Contenido {
  id: string;
  titulo: string;
  tipo: 'cancion' | 'podcast';
  autor: string;
  genero: string;
  duracion: string;
  urlImagen?: string;
}

export default function Favoritos() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<Contenido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarFavoritos = useCallback(async () => {
    try {
      const response = await fetch('/api/favoritos');
      if (response.ok) {
        const data = await response.json();
        setFavoritos(data);
      } else {
        console.error('Error cargando favoritos');
      }
    } catch (error) {
      console.error('Error cargando favoritos:', error);
      setError('Error al cargar favoritos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return;
    }
    cargarFavoritos();
  }, [session, status, router, cargarFavoritos]);

  const reproducirContenido = async (contenidoId: string) => {
    try {
      await fetch('/api/reproducir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenidoId })
      });
    } catch (error) {
      console.error('Error registrando reproducción:', error);
    }
  };

  const quitarFavorito = async (contenidoId: string) => {
    try {
      const response = await fetch('/api/favoritos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-type': 'registrado',
        },
        body: JSON.stringify({ contenidoId })
      });
      
      if (response.ok) {
        setFavoritos(prev => prev.filter(item => item.id !== contenidoId));
      } else {
        const data = await response.json();
        setError(data.error || 'No se pudo quitar el favorito');
      }
    } catch (error) {
      console.error('Error quitando favorito:', error);
      setError('Error quitando favorito');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-900 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Cargando favoritos...</p>
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
              onClick={cargarFavoritos}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return null; // Será redirigido por useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Botón para volver al inicio */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg shadow hover:bg-gray-800 transition-colors">
            <span className="mr-2">←</span> Volver al inicio
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">❤️ Mis Favoritos</h1>
          <p className="text-gray-700 mb-4">
            Tu colección personal de música y podcasts
          </p>
          <div className="text-sm text-gray-600">
            {favoritos.length} elementos guardados
          </div>
        </div>

        {/* Grid de favoritos */}
        {favoritos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favoritos.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onPlay={reproducirContenido}
                onToggleFavorite={quitarFavorito}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes favoritos</h3>
            <p className="text-gray-700 mb-6">Agrega canciones y podcasts a tus favoritos para verlos aquí</p>
            <Link 
              href="/" 
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Explorar Contenido
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600 text-sm">
          <p>Los favoritos se sincronizan automáticamente en todos tus dispositivos</p>
        </div>
      </div>
    </div>
  );
}

// Componente de tarjeta de contenido
function ContentCard({ 
  item, 
  onPlay, 
  onToggleFavorite
}: {
  item: Contenido;
  onPlay: (contenidoId: string) => void;
  onToggleFavorite: (contenidoId: string) => void;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300">
      <div className="relative">
        <Image
          src={item.urlImagen || '/placeholder-music.jpg'}
          alt={item.titulo}
          className="w-full h-48 object-cover rounded-lg mb-4"
          width={300}
          height={192}
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full">
            {item.tipo === 'cancion' ? '🎵' : '🎙️'}
          </span>
        </div>
      </div>
      
      <h3 className="text-gray-900 font-semibold text-lg mb-2 truncate">{item.titulo}</h3>
      <p className="text-gray-700 text-sm mb-1">{item.autor}</p>
      <p className="text-gray-500 text-xs mb-3">{item.genero} • {item.duracion}</p>
      
              <div className="flex items-center justify-between">
          <button
            onClick={() => onPlay(item.id)}
            className="px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            ▶️ Reproducir
          </button>
        
        <button
          onClick={() => onToggleFavorite(item.id)}
          className="p-2 text-red-400 hover:text-red-300 transition-colors"
          title="Quitar de favoritos"
        >
          ❤️
        </button>
      </div>
    </div>
  );
} 