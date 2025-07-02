import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { UsuarioRepositoryNeo4j } from '@/infrastructure/repositories/UsuarioRepositoryNeo4j';
import { Usuario } from '@/entities/models/Usuario';

const usuarioRepo = new UsuarioRepositoryNeo4j();

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

    // Verificar si el usuario ya existe
    const existingUser = await usuarioRepo.buscarPorEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 }
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario usando el caso de uso
    const usuario = new Usuario({
      id: crypto.randomUUID(),
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

    await usuarioRepo.crear(usuario);

    return NextResponse.json({
      message: 'Usuario creado exitosamente en Neo4j',
      user: {
        id: usuario.getId(),
        email: usuario.getEmail(),
        name: usuario.getNombre(),
        rol: usuario.getRol()
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error al crear usuario en Neo4j:', error);
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    let usuario: Usuario | null = null;

    if (email) {
      usuario = await usuarioRepo.buscarPorEmail(email);
    } else if (id) {
      usuario = await usuarioRepo.buscarPorId(id);
    } else {
      return NextResponse.json(
        { error: 'Se requiere email o id para buscar usuario' },
        { status: 400 }
      );
    }

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: usuario.getId(),
        email: usuario.getEmail(),
        name: usuario.getNombre(),
        rol: usuario.getRol(),
        fechaRegistro: usuario.getFechaRegistro(),
        preferencias: usuario.getPreferencias()
      }
    });

  } catch (error: any) {
    console.error('Error al buscar usuario en Neo4j:', error);
    return NextResponse.json(
      { error: 'Error al buscar usuario' },
      { status: 500 }
    );
  }
} 