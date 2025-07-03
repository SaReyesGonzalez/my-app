'use client';

import { Contenido } from '../../types/content';
import { useState } from 'react';
import Image from 'next/image';

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
  const [showPlayer, setShowPlayer] = useState(false);

  const handlePlay = () => {
    if (contenido.urlAudio) {
      setShowPlayer((prev) => !prev);
    }
    if (onPlay) {
      onPlay(contenido.id);
    }
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(contenido.id);
    }
  };

  // Si la imagen falla, usar el placeholder local
  const handleImgError = () => {
    setImgSrc('/placeholder-music.jpg');
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-purple-200 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen */}
      <div className="relative aspect-square">
        <Image
          src={typeof imgSrc === 'string' && imgSrc.length > 0 ? imgSrc : '/placeholder-music.jpg'}
          alt={contenido.titulo}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="w-full h-full object-cover rounded-t-lg"
          style={{ objectFit: 'cover' }}
          priority={true}
          onError={handleImgError}
        />
        
        {/* Overlay con botones */}
        <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex gap-2">
            <button
              onClick={handlePlay}
              className="bg-purple-100 text-purple-800 p-2 rounded-full hover:bg-purple-200 transition-colors"
            >
              ▶️
            </button>
            
            {showFavoriteButton && (
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            )}
          </div>
        </div>

        {/* Badge de tipo */}
        <div className="absolute top-2 left-2">
          <span className="bg-purple-600 bg-opacity-90 text-white px-2 py-1 text-xs font-medium rounded-full">
            {contenido.tipo === 'cancion' ? '🎵' : '🎙️'}
          </span>
        </div>
      </div>

      {/* Información */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate" title={contenido.titulo}>
          {contenido.titulo}
        </h3>
        <p className="text-sm text-gray-700 truncate" title={contenido.autor}>
          {contenido.autor}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded">
            {contenido.genero}
          </span>
          <span className="text-xs text-gray-600">
            {contenido.duracion}
          </span>
        </div>
        {/* Reproductor de audio */}
        {contenido.urlAudio && showPlayer && (
          <audio controls autoPlay className="mt-3 w-full">
            <source src={contenido.urlAudio} type="audio/mpeg" />
            Tu navegador no soporta el elemento de audio.
          </audio>
        )}
      </div>
    </div>
  );
} 