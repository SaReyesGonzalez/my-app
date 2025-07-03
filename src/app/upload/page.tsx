'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [titulo, setTitulo] = useState('');
  const [autorId, setAutorId] = useState('');
  const [generoId, setGeneroId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !titulo || !autorId || !generoId) {
      setError('Por favor completa todos los campos');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('titulo', titulo);
      formData.append('autorId', autorId);
      formData.append('generoId', generoId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Archivo subido exitosamente!');
        setFile(null);
        setTitulo('');
        setAutorId('');
        setGeneroId('');
        
        // Limpiar el input de archivo
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Redirigir a la biblioteca después de 2 segundos
        setTimeout(() => {
          router.push('/music');
        }, 2000);
      } else {
        setError(data.error || 'Error al subir el archivo');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🎵 Subir Canción
          </h1>

          {message && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Archivo de Audio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo de Audio *
              </label>
              <input
                id="file-input"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Formatos permitidos: MP3, WAV, OGG. Máximo 50MB.
              </p>
              {file && (
                <p className="mt-2 text-sm text-blue-600">
                  Archivo seleccionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Canción *
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Mi Canción Favorita"
                required
              />
            </div>

            {/* Autor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Autor/Artista *
              </label>
              <input
                type="text"
                value={autorId}
                onChange={(e) => setAutorId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Mi Artista"
                required
              />
            </div>

            {/* Género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Género *
              </label>
              <select
                value={generoId}
                onChange={(e) => setGeneroId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona un género</option>
                <option value="rock">Rock</option>
                <option value="pop">Pop</option>
                <option value="jazz">Jazz</option>
                <option value="classical">Clásica</option>
                <option value="electronic">Electrónica</option>
                <option value="folk">Folk</option>
                <option value="ambient">Ambient</option>
                <option value="hip-hop">Hip Hop</option>
                <option value="country">Country</option>
                <option value="reggae">Reggae</option>
                <option value="blues">Blues</option>
                <option value="other">Otro</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Subiendo...
                  </div>
                ) : (
                  'Subir Canción'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/music')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>

          {/* Información adicional */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Información:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Los archivos se guardan localmente en la carpeta <code>public/uploads/</code></li>
              <li>• Después de subir, la canción estará disponible en la biblioteca</li>
              <li>• Puedes acceder a tus canciones en la página de música</li>
              <li>• Los archivos se sirven directamente desde el servidor</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 