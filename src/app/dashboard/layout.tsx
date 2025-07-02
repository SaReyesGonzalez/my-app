'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-blue-700 text-white shadow">
        <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span role="img" aria-label="logo">🎵</span> Plataforma Streaming
        </div>
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            placeholder="Buscar canciones, artistas, podcasts..."
            className="w-full max-w-md px-4 py-2 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled
          />
        </div>
        <div
          className="relative ml-4"
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          <button
            onClick={() => router.push("/my-account")}
            className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold shadow hover:bg-blue-100 transition"
          >
            Mi Cuenta
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-md shadow-lg z-10 p-4">
              <div className="mb-2">
                <span className="font-semibold">Nombre:</span> {session?.user?.name || "Invitado"}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Email:</span> {session?.user?.email || "-"}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="w-full mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 