"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Cargando...</h1>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Bienvenido, {session?.user?.name || 'Usuario'}</h2>
        <p className="text-gray-700">
          Esta es tu página de dashboard. Aquí podrás ver tus playlists, canciones favoritas y más.
        </p>
      </div>
    </div>
  );
} 