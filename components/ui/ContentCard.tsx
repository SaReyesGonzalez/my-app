'use client';

import { Contenido } from '../../types/content';
import { useState } from 'react';
import Image from 'next/image';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useSession } from 'next-auth/react';

interface ContentCardProps {
  contenido: Contenido;
  isFavorite?: boolean;
  onPlay?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  showFavoriteButton?: boolean;
}

export default function ContentCard({
  contenido,
  isFavorite = false,
  onPlay,
  onToggleFavorite,
  showFavoriteButton = true
}: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(contenido.urlImagen || '/placeholder-music.jpg');
  const { playTrack } = useAudioPlayer();
  const { data: session } = useSession();
  const [favLoading, setFavLoading] = useState(false);
  const [favError, setFavError] = useState<string | null>(null);

  const handlePlay = () => {
    if (contenido.urlAudio) {
      playTrack(contenido);
    }
    if (onPlay) {
      onPlay(contenido.id);
    }
  };

  const handleToggleFavorite = async () => {
    if (onToggleFavorite) {
      setFavLoading(true);
      setFavError(null);
      try {
        const response = await fetch('/api/favoritos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-type': 'registrado',
          },
          body: JSON.stringify({ contenido: { id: contenido.id } })
        });
        if (!response.ok) {
          const data = await response.json();
          setFavError(data.error || 'No se pudo agregar a favoritos');
        } else {
          onToggleFavorite(contenido.id);
        }
      } catch (error) {
        setFavError('Error agregando a favoritos');
      } finally {
        setFavLoading(false);
      }
    }
  };

  // Si la imagen falla, usar el placeholder local
  const handleImgError = () => {
    setImgSrc('/placeholder-music.jpg');
  };

  // Valores por defecto
  const titulo = contenido.titulo || 'Sin título';
  const autor = contenido.autor || 'Desconocido';

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300 flex flex-col justify-between h-full">
      <div className="relative">
        <img
          src={imgSrc}
          alt={titulo}
          className="w-full h-48 object-cover rounded-lg mb-4 bg-gray-200"
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full">
            {contenido.tipo === 'cancion' ? '🎵' : '🎙️'}
          </span>
        </div>
      </div>
      <div className="mb-2 font-bold text-lg text-gray-900 truncate">{titulo}</div>
      <div className="mb-2 text-gray-700 text-sm truncate">{autor}</div>
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={handlePlay}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors"
        >
          ▶️ Reproducir
        </button>
        {showFavoriteButton && session?.user?.id && (
          <button
            onClick={handleToggleFavorite}
            disabled={favLoading}
            className="ml-2 px-3 py-1 rounded bg-pink-500 text-white hover:bg-pink-600 transition-colors disabled:opacity-50"
            title="Agregar a favoritos"
          >
            ❤️
          </button>
        )}
      </div>
      {favError && <div className="text-xs text-red-500 mt-1">{favError}</div>}
    </div>
  );
} 