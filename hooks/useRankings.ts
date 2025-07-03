import { useState, useEffect } from 'react';

interface RankingItem {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  reproducciones: number;
  posicion: number;
  urlImagen: string;
}

interface RankingsResponse {
  categoria: string;
  ranking: RankingItem[];
  total: number;
  actualizado: string;
}

export function useRankings() {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [categoria, setCategoria] = useState('global');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [actualizado, setActualizado] = useState<string>('');

  const categorias = [
    { id: 'global', nombre: 'Global', icon: '🌍' },
    { id: 'kpop', nombre: 'K-pop', icon: '🇰🇷' },
    { id: 'rock', nombre: 'Rock', icon: '🎸' },
    { id: 'trending', nombre: 'Tendencias', icon: '🔥' }
  ];

  const cargarRanking = async (categoriaSeleccionada: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/rankings?categoria=${categoriaSeleccionada}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar el ranking');
      }
      
      const data: RankingsResponse = await response.json();
      
      setRankings(data.ranking);
      setCategoria(data.categoria);
      setTotal(data.total);
      setActualizado(data.actualizado);
    } catch (err) {
      setError('Error al cargar el ranking');
      console.error('Error cargando ranking:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRanking(categoria);
  }, []);

  const cambiarCategoria = (nuevaCategoria: string) => {
    setCategoria(nuevaCategoria);
    cargarRanking(nuevaCategoria);
  };

  const refrescarRanking = () => {
    cargarRanking(categoria);
  };

  return {
    rankings,
    categoria,
    categorias,
    loading,
    error,
    total,
    actualizado,
    cambiarCategoria,
    refrescarRanking
  };
} 