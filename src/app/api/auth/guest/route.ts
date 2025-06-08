import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { User } from '@/models/User';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Crear usuario invitado
    const guestUser: User = {
      email: `guest_${Date.now()}@guest.com`,
      password: '', // Los invitados no tienen contraseña
      name: `Invitado_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        favoriteGenres: [],
        favoriteArtists: [],
        favoritePodcasts: []
      },
      isGuest: true
    };

    const result = await db.collection('users').insertOne(guestUser);

    // Almacenar la sesión del invitado en Redis
    const redisClient = (await import('@/lib/db/redis')).default;
    await redisClient.set(
      `guest:${result.insertedId}`,
      JSON.stringify({
        id: result.insertedId.toString(),
        name: guestUser.name,
        isGuest: true
      }),
      {
        EX: 24 * 60 * 60 // Expira en 24 horas
      }
    );

    return NextResponse.json({
      message: 'Usuario invitado creado exitosamente',
      user: {
        id: result.insertedId.toString(),
        name: guestUser.name,
        isGuest: true
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario invitado:', error);
    return NextResponse.json(
      { error: 'Error al crear usuario invitado' },
      { status: 500 }
    );
  }
} 