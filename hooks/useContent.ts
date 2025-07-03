import { useState, useEffect } from 'react';
import { Contenido } from '../types/content';
import { ContentService } from '../services/contentService';

export function useContent() {
  const [contenido, setContenido] = useState<Contenido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarContenido();
  }, []);

  const cargarContenido = async () => {
    try {
      setLoading(true);
      const data = await ContentService.obtenerContenido();
      setContenido(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el contenido');
      console.error('Error cargando contenido:', err);
    } finally {
      setLoading(false);
    }
  };

  const buscarContenido = async (query: string) => {
    try {
      setLoading(true);
      const resultados = await ContentService.buscarContenido(query);
      setContenido(resultados);
      setError(null);
    } catch (err) {
      setError('Error en la búsqueda');
      console.error('Error buscando contenido:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    contenido,
    loading,
    error,
    cargarContenido,
    buscarContenido
  };
}

export function useRecomendaciones() {
  const [recomendaciones, setRecomendaciones] = useState<Contenido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarRecomendaciones();
  }, []);

  const cargarRecomendaciones = async () => {
    try {
      setLoading(true);
      const data = await ContentService.obtenerRecomendaciones();
      setRecomendaciones(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las recomendaciones');
      console.error('Error cargando recomendaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    recomendaciones,
    loading,
    error,
    cargarRecomendaciones
  };
} 