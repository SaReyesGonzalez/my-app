import { NextRequest, NextResponse } from 'next/server';
import redis from '../../../lib/redis';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  let userType = 'invitado';

  if (token) {
    // Verifica el token en Redis
    const session = await redis.get(`session:${token}`);
    if (session) {
      userType = 'registrado';
    }
  }

  // Guarda el tipo de usuario en la request para usarlo en los endpoints
  req.headers.set('x-user-type', userType);
  return NextResponse.next({ request: req });
}

// Puedes aplicar este middleware a rutas específicas en next.config.js o en los endpoints críticos 