'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleManualSignUp = async () => {
    console.log('Iniciando registro manual con:', formData);
    
    // Validación básica
    if (!formData.nombre.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }
    
    if (!formData.password.trim()) {
      setError('Por favor ingresa tu contraseña');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      console.log('Enviando datos de registro...');
      
      // Aquí normalmente harías una llamada a tu API para crear el usuario
      // Por ahora, simularemos el registro exitoso
      
      // Simular delay de registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Registro exitoso, iniciando sesión automáticamente...');
      
      // Iniciar sesión automáticamente después del registro
      const result = await signIn('credentials', {
        email: formData.email.trim(),
        password: formData.password.trim(),
        redirect: false,
      });

      console.log('Resultado del login post-registro:', result);

      if (result?.error) {
        setError('Error al iniciar sesión después del registro. Intenta iniciar sesión manualmente.');
      } else {
        console.log('Login exitoso post-registro, redirigiendo...');
        router.push('/');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setError('Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleManualSignUp();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border border-purple-200">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          🎵 Crear Cuenta
        </h1>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-white text-sm font-medium mb-2">
              Nombre Completo
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              placeholder="Tu nombre completo"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            type="button"
            onClick={handleManualSignUp}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/signin')}
              disabled={loading}
              className="text-purple-400 hover:text-purple-300 underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Iniciar Sesión
            </button>
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push('/')}
            disabled={loading}
            className="text-white/60 hover:text-white text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
} 