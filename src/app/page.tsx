import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  console.log('Entrando a Home (page.tsx)');
  let session = null;
  try {
    session = await getServerSession(authOptions as any);
    console.log('Valor de session:', session);
  } catch (error) {
    console.error('Error en getServerSession:', error);
  }
  if (session && session.user) {
    console.log('Redirigiendo a /dashboard');
    redirect('/dashboard');
  } else {
    console.log('Redirigiendo a /auth/signin');
    redirect('/auth/signin');
  }
  // Fallback visual si no redirige
  return <div style={{color: 'white', background: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>No se pudo redirigir automáticamente. Revisa la consola del servidor.</div>;
}
