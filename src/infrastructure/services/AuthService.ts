import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import redis from '../../../lib/redis';
import { Usuario } from '../../entities/models/Usuario';

export interface TokenPayload {
  userId: string;
  email: string;
  rol: string;
  iat: number;
  exp: number;
}

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly TOKEN_EXPIRY: number = 24 * 60 * 60; // 24 horas en segundos

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  }

  async generarToken(usuario: Usuario): Promise<string> {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId: usuario.getId(),
      email: usuario.getEmail() || '',
      rol: usuario.getRol()
    };

    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.TOKEN_EXPIRY
    });

    // Almacenar token en Redis con expiración
    const redisKey = `auth:token:${usuario.getId()}`;
    await redis.setex(redisKey, this.TOKEN_EXPIRY, token);

    return token;
  }

  async validarToken(token: string): Promise<TokenPayload | null> {
    try {
      const payload = jwt.verify(token, this.JWT_SECRET) as TokenPayload;
      
      // Verificar si el token existe en Redis
      const redisKey = `auth:token:${payload.userId}`;
      const storedToken = await redis.get(redisKey);
      
      if (!storedToken || storedToken !== token) {
        return null; // Token no válido o expirado
      }

      return payload;
    } catch {
      return null;
    }
  }

  async invalidarToken(userId: string): Promise<void> {
    const redisKey = `auth:token:${userId}`;
    await redis.del(redisKey);
  }

  async invalidarTodosLosTokens(userId: string): Promise<void> {
    const pattern = `auth:token:${userId}`;
    const keys = await redis.keys(pattern);
    
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async verificarPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generarTokenInvitado(): Promise<string> {
    const payload = {
      userId: `invitado_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: 'invitado@temporal.com',
      rol: 'invitado'
    };

    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: 60 * 60 // 1 hora para invitados
    });

    // Almacenar token de invitado en Redis
    const redisKey = `auth:invitado:${payload.userId}`;
    await redis.setex(redisKey, 60 * 60, token);

    return token;
  }

  async renovarToken(userId: string): Promise<string | null> {
    const redisKey = `auth:token:${userId}`;
    const currentToken = await redis.get(redisKey);
    
    if (!currentToken) {
      return null;
    }

    try {
      const payload = jwt.verify(currentToken, this.JWT_SECRET) as TokenPayload;
      
      // Generar nuevo token
      const newPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
        userId: payload.userId,
        email: payload.email,
        rol: payload.rol
      };

      const newToken = jwt.sign(newPayload, this.JWT_SECRET, {
        expiresIn: this.TOKEN_EXPIRY
      });

      // Actualizar en Redis
      await redis.setex(redisKey, this.TOKEN_EXPIRY, newToken);

      return newToken;
    } catch {
      return null;
    }
  }

  async obtenerUsuarioActivo(token: string): Promise<TokenPayload | null> {
    const payload = await this.validarToken(token);
    if (!payload) return null;

    // Verificar si el usuario sigue activo
    const redisKey = `auth:token:${payload.userId}`;
    const storedToken = await redis.get(redisKey);
    
    return storedToken === token ? payload : null;
  }
} 