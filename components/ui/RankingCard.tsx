'use client';

import { useState } from 'react';
import Image from 'next/image';

interface RankingItem {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  reproducciones: number;
  posicion: number;
  urlImagen: string;
}

interface RankingCardProps {
  item: RankingItem;
  onPlay?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export default function RankingCard({
  item,
  onPlay,
  onToggleFavorite,
  isFavorite = false
}: RankingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = () => {
    if (onPlay) {
      onPlay(item.id);
    }
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(item.id);
    }
  };

  const formatReproducciones = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getPositionColor = (posicion: number): string => {
    switch (posicion) {
      case 1: return 'bg-yellow-500 text-white';
      case 2: return 'bg-gray-400 text-white';
      case 3: return 'bg-amber-600 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div
      className="relative bg-white rounded-lg shadow-sm border border-purple-200 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Posición */}
      <div className="absolute top-2 left-2 z-10">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getPositionColor(item.posicion)}`}>
          {item.posicion}
        </div>
      </div>

      {/* Imagen */}
      <div className="relative aspect-square">
        <Image
          src={item.urlImagen || '/placeholder-music.jpg'}
          alt={item.titulo}
          width={300}
          height={192}
          className="w-full h-32 object-cover rounded-lg mb-4"
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
            
            {onToggleFavorite && (
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

        {/* Badge de reproducciones */}
        <div className="absolute top-2 right-2">
          <span className="bg-purple-600 bg-opacity-90 text-white px-2 py-1 text-xs font-medium rounded-full">
            🎵 {formatReproducciones(item.reproducciones)}
          </span>
        </div>
      </div>

      {/* Información */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate" title={item.titulo}>
          {item.titulo}
        </h3>
        <p className="text-sm text-gray-700 truncate" title={item.autor}>
          {item.autor}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded">
            {item.genero}
          </span>
          <div className="flex items-center text-xs text-gray-600">
            <span className="mr-1">👁️</span>
            {formatReproducciones(item.reproducciones)} reproducciones
          </div>
        </div>
      </div>

      {/* Indicador de tendencia */}
      {item.posicion <= 3 && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-transparent to-yellow-400 w-8 h-8 opacity-75"></div>
      )}
    </div>
  );
} 