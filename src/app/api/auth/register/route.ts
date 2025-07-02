import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/db/mongodb';
import { User } from '@/models/User';
import { Usuario, RolUsuario } from '@/entities/models/Usuario';

function validarEmail(email: string): boolean {
  // Validación básica de email
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validaciones básicas
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }
    if (!validarEmail(email)) {
      return NextResponse.json(
        { error: 'El email no es válido' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }
    if (name.length < 2) {
      return NextResponse.json(
        { error: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Verificar si el usuario ya existe
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 }
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Usar la clase Usuario para validar y construir el usuario
    let usuario: Usuario;
    try {
      usuario = new Usuario({
        id: '', // MongoDB lo asigna automáticamente
        rol: 'usuario',
        nombre: name,
        email,
        contraseñaHash: hashedPassword,
        fechaRegistro: new Date(),
        preferencias: {
          generosFavoritos: [],
          artistasFavoritos: []
        }
      });
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message || 'Error de validación' },
        { status: 400 }
      );
    }

    // Guardar el usuario en la base de datos
    const newUser: User = {
      email: usuario.getEmail()!,
      password: usuario.getContraseñaHash()!,
      name: usuario.getNombre()!,
      createdAt: usuario.getFechaRegistro()!,
      updatedAt: usuario.getFechaRegistro()!,
      preferences: {
        favoriteGenres: [],
        favoriteArtists: [],
        favoritePodcasts: []
      },
      isGuest: false,
      rol: usuario.getRol() as RolUsuario
    };

    await db.collection('users').insertOne(newUser);

    return NextResponse.json(
      { message: 'Usuario creado exitosamente' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json(
      { error: 'Error al crear el usuario' },
      { status: 500 }
    );
  }
} 