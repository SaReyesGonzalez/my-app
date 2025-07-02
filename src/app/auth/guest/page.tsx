'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button } from '@/components/ui/Form';
import Link from 'next/link';

export default function GuestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGuestAccess = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear usuario invitado');
      }

      // Redirigir al dashboard después de crear el usuario invitado
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario invitado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acceso como invitado
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a la plataforma sin crear una cuenta
          </p>
        </div>

        <Form onSubmit={(e) => { e.preventDefault(); handleGuestAccess(); }}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Como invitado podrás:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Explorar la biblioteca de música y podcasts</li>
              <li>Crear playlists temporales</li>
              <li>Recibir recomendaciones básicas</li>
            </ul>
            <p className="text-sm text-gray-600">
              Ten en cuenta que tu sesión expirará en 24 horas
            </p>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Continuar como invitado
          </Button>

          <div className="text-center space-y-2">
            <Link href="/auth/signin" className="text-sm text-blue-600 hover:text-blue-500 block">
              Iniciar sesión
            </Link>
            <Link href="/auth/register" className="text-sm text-blue-600 hover:text-blue-500 block">
              Crear una cuenta
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
} 