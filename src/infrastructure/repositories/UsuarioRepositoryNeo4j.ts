import { Usuario } from "../../entities/models/Usuario";
import { UsuarioRepository } from "../../application/repositories/UsuarioRepository";
import { executeQuery, executeSingleQuery } from "../../lib/db/neo4j";

export class UsuarioRepositoryNeo4j implements UsuarioRepository {
    
    async crear(usuario: Usuario): Promise<void> {
        const query = `
            CREATE (u:Usuario {
                id: $id,
                email: $email,
                nombre: $nombre,
                contraseñaHash: $contraseñaHash,
                rol: $rol,
                fechaRegistro: datetime($fechaRegistro),
                generosFavoritos: $generosFavoritos,
                artistasFavoritos: $artistasFavoritos
            })
        `;
        
        await executeQuery(query, {
            id: usuario.getId(),
            email: usuario.getEmail(),
            nombre: usuario.getNombre(),
            contraseñaHash: usuario.getContraseñaHash(),
            rol: usuario.getRol(),
            fechaRegistro: usuario.getFechaRegistro()?.toISOString(),
            generosFavoritos: usuario.getPreferencias()?.generosFavoritos || [],
            artistasFavoritos: usuario.getPreferencias()?.artistasFavoritos || []
        });
    }

    async buscarPorEmail(email: string): Promise<Usuario | null> {
        const query = `
            MATCH (u:Usuario {email: $email})
            RETURN u
        `;
        
        const result = await executeSingleQuery<{u: any}>(query, { email });
        
        if (!result) return null;
        
        const userData = result.u.properties;
        return new Usuario({
            id: userData.id,
            rol: userData.rol,
            nombre: userData.nombre,
            email: userData.email,
            contraseñaHash: userData.contraseñaHash,
            fechaRegistro: new Date(userData.fechaRegistro),
            preferencias: {
                generosFavoritos: userData.generosFavoritos || [],
                artistasFavoritos: userData.artistasFavoritos || []
            }
        });
    }

    async buscarPorId(id: string): Promise<Usuario | null> {
        const query = `
            MATCH (u:Usuario {id: $id})
            RETURN u
        `;
        
        const result = await executeSingleQuery<{u: any}>(query, { id });
        
        if (!result) return null;
        
        const userData = result.u.properties;
        return new Usuario({
            id: userData.id,
            rol: userData.rol,
            nombre: userData.nombre,
            email: userData.email,
            contraseñaHash: userData.contraseñaHash,
            fechaRegistro: new Date(userData.fechaRegistro),
            preferencias: {
                generosFavoritos: userData.generosFavoritos || [],
                artistasFavoritos: userData.artistasFavoritos || []
            }
        });
    }

    async actualizar(usuario: Usuario): Promise<void> {
        const query = `
            MATCH (u:Usuario {id: $id})
            SET u.email = $email,
                u.nombre = $nombre,
                u.contraseñaHash = $contraseñaHash,
                u.rol = $rol,
                u.generosFavoritos = $generosFavoritos,
                u.artistasFavoritos = $artistasFavoritos
        `;
        
        await executeQuery(query, {
            id: usuario.getId(),
            email: usuario.getEmail(),
            nombre: usuario.getNombre(),
            contraseñaHash: usuario.getContraseñaHash(),
            rol: usuario.getRol(),
            generosFavoritos: usuario.getPreferencias()?.generosFavoritos || [],
            artistasFavoritos: usuario.getPreferencias()?.artistasFavoritos || []
        });
    }

    async eliminar(id: string): Promise<void> {
        const query = `
            MATCH (u:Usuario {id: $id})
            DETACH DELETE u
        `;
        
        await executeQuery(query, { id });
    }

    // Métodos adicionales específicos para Neo4j
    async buscarUsuariosPorGenero(genero: string): Promise<Usuario[]> {
        const query = `
            MATCH (u:Usuario)
            WHERE $genero IN u.generosFavoritos
            RETURN u
        `;
        
        const results = await executeQuery<{u: any}>(query, { genero });
        
        return results.map(result => {
            const userData = result.u.properties;
            return new Usuario({
                id: userData.id,
                rol: userData.rol,
                nombre: userData.nombre,
                email: userData.email,
                contraseñaHash: userData.contraseñaHash,
                fechaRegistro: new Date(userData.fechaRegistro),
                preferencias: {
                    generosFavoritos: userData.generosFavoritos || [],
                    artistasFavoritos: userData.artistasFavoritos || []
                }
            });
        });
    }

    async crearRelacionUsuarioGenero(usuarioId: string, genero: string): Promise<void> {
        const query = `
            MATCH (u:Usuario {id: $usuarioId})
            MERGE (g:Genero {nombre: $genero})
            MERGE (u)-[:PREFIERE]->(g)
        `;
        
        await executeQuery(query, { usuarioId, genero });
    }

    async crearRelacionUsuarioArtista(usuarioId: string, artistaId: string): Promise<void> {
        const query = `
            MATCH (u:Usuario {id: $usuarioId})
            MATCH (a:Artista {id: $artistaId})
            MERGE (u)-[:SIGUE]->(a)
        `;
        
        await executeQuery(query, { usuarioId, artistaId });
    }
} 