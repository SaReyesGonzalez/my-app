import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = ['/', '/auth', '/auth/signin', '/auth/register', '/auth/guest'];
const PRIVATE_PATHS = ['/dashboard', '/my-account'];

// Log inicial para verificar que el middleware se carga
console.log('=== MIDDLEWARE CARGADO ===');

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET
  });

  const { pathname } = request.nextUrl;

  // Lógica especial para la raíz '/' y '/auth'
  if (pathname === '/' || pathname === '/auth') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  // Si está autenticado y va a una ruta pública de auth, redirige a dashboard
  if (token && PUBLIC_PATHS.some(path => pathname.startsWith(path) && path !== '/' && path !== '/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Si NO está autenticado y va a una ruta privada, redirige a signin
  if (!token && PRIVATE_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

// Configuración del matcher
export const config = {
  matcher: [
    '/',
    '/auth',
    '/dashboard/:path*',
    '/my-account/:path*',
    '/auth/signin',
    '/auth/register',
    '/auth/guest'
  ]
}; 