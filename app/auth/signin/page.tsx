'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleManualLogin = async () => {
    console.log('Iniciando login manual con:', { email, password });
    
    // Validación básica
    if (!email.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }
    
    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña');
      return;
    }
    
    if (password.length < 3) {
      setError('La contraseña debe tener al menos 3 caracteres');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      console.log('Enviando credenciales...');
      const result = await signIn('credentials', {
        email: email.trim(),
        password: password.trim(),
        redirect: false,
      });

      console.log('Resultado del login:', result);

      if (result?.error) {
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
      } else {
        console.log('Login exitoso, redirigiendo...');
        router.push('/');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    console.log('Iniciando login demo...');
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        email: 'demo@test.com',
        password: 'demo123',
        redirect: false,
      });

      if (result?.error) {
        setError('Error al usar cuenta de demo');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error al usar cuenta de demo:', error);
      setError('Error al usar cuenta de demo');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleManualLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border border-purple-200">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          🎵 Iniciar Sesión
        </h1>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-purple-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 rounded-lg border border-purple-300 text-purple-800 placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 bg-purple-50"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-purple-700 text-sm font-medium mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 rounded-lg border border-purple-300 text-purple-800 placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 bg-purple-50"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="text-red-700 text-sm text-center bg-red-50 border border-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            type="button"
            onClick={handleManualLogin}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-purple-600 text-sm">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/signup')}
              disabled={loading}
              className="text-purple-800 hover:text-purple-600 underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Registrarse
            </button>
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-purple-600 text-sm">
            O{' '}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="text-purple-800 hover:text-purple-600 underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Usar cuenta de demo
            </button>
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push('/')}
            disabled={loading}
            className="text-purple-600 hover:text-purple-800 text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
} 