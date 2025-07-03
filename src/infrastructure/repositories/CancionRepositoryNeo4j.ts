import { Cancion } from "../../entities/models/Cancion";
import { Autor } from "../../entities/models/Autor";
import { Genero } from "../../entities/models/Genero";
import { executeQuery, executeSingleQuery } from "../../lib/db/neo4j";

export class CancionRepositoryNeo4j {
    
    async crearCancion(cancion: Cancion, autor: Autor, genero: Genero): Promise<void> {
        const query = `
            MERGE (c:Cancion {
                id: $cancionId,
                titulo: $cancionTitulo,
                duracion: $duracion
            })
            MERGE (a:Autor {
                id: $autorId,
                nombre: $autorNombre,
                biografia: $biografia
            })
            MERGE (g:Genero {
                id: $generoId,
                nombre: $generoNombre,
                descripcion: $descripcion
            })
            MERGE (a)-[:CANTA]->(c)
            MERGE (c)-[:ES_GENERO]->(g)
        `;
        
        await executeQuery(query, {
            cancionId: cancion.getId(),
            cancionTitulo: cancion.getTitulo(),
            duracion: cancion.getDuracion(),
            autorId: autor.getId(),
            autorNombre: autor.getNombre(),
            biografia: autor.getBiografia(),
            generoId: genero.getId(),
            generoNombre: genero.getNombre(),
            descripcion: genero.getDescripcion()
        });
    }

    async registrarReproduccion(usuarioId: string, cancionId: string): Promise<void> {
        const query = `
            MATCH (u:Usuario {id: $usuarioId})
            MATCH (c:Cancion {id: $cancionId})
            MERGE (u)-[:ESCUCHA {fecha: datetime()}]->(c)
        `;
        
        await executeQuery(query, { usuarioId, cancionId });
    }

    async obtenerRecomendacionesPorUsuario(usuarioId: string, limite: number = 10): Promise<Cancion[]> {
        const query = `
            MATCH (u:Usuario {id: $usuarioId})-[:ESCUCHA]->(c1:Cancion)-[:ES_GENERO]->(g:Genero)<-[:ES_GENERO]-(c2:Cancion)
            WHERE c1 <> c2
            WITH c2, count(*) as peso
            ORDER BY peso DESC
            LIMIT $limite
            RETURN c2
        `;
        
        const results = await executeQuery<{c2: any}>(query, { usuarioId, limite });
        
        return results.map(result => {
            const cancionData = result.c2.properties;
            return new Cancion({
                id: cancionData.id,
                titulo: cancionData.titulo,
                duracion: cancionData.duracion,
                autorId: cancionData.autorId,
                generoId: cancionData.generoId,
                fechaLanzamiento: new Date(cancionData.fechaLanzamiento)
            });
        });
    }

    async obtenerRecomendacionesPorGenero(generoId: string, limite: number = 10): Promise<Cancion[]> {
        const query = `
            MATCH (g:Genero {id: $generoId})<-[:ES_GENERO]-(c:Cancion)
            RETURN c
            LIMIT $limite
        `;
        
        const results = await executeQuery<{c: any}>(query, { generoId, limite });
        
        return results.map(result => {
            const cancionData = result.c.properties;
            return new Cancion({
                id: cancionData.id,
                titulo: cancionData.titulo,
                duracion: cancionData.duracion,
                autorId: cancionData.autorId,
                generoId: cancionData.generoId,
                fechaLanzamiento: new Date(cancionData.fechaLanzamiento)
            });
        });
    }

    async obtenerCancionesSimilares(cancionId: string, limite: number = 5): Promise<Cancion[]> {
        const query = `
            MATCH (c1:Cancion {id: $cancionId})-[:ES_GENERO]->(g:Genero)<-[:ES_GENERO]-(c2:Cancion)
            WHERE c1 <> c2
            WITH c2, count(*) as similitud
            ORDER BY similitud DESC
            LIMIT $limite
            RETURN c2
        `;
        
        const results = await executeQuery<{c2: any}>(query, { cancionId, limite });
        
        return results.map(result => {
            const cancionData = result.c2.properties;
            return new Cancion({
                id: cancionData.id,
                titulo: cancionData.titulo,
                duracion: cancionData.duracion,
                autorId: cancionData.autorId,
                generoId: cancionData.generoId,
                fechaLanzamiento: new Date(cancionData.fechaLanzamiento)
            });
        });
    }

    async obtenerAutoresRecomendados(usuarioId: string, limite: number = 5): Promise<Autor[]> {
        const query = `
            MATCH (u:Usuario {id: $usuarioId})-[:ESCUCHA]->(c:Cancion)-[:CANTA]->(a:Autor)
            WITH a, count(*) as reproducciones
            ORDER BY reproducciones DESC
            LIMIT $limite
            RETURN a
        `;
        
        const results = await executeQuery<{a: any}>(query, { usuarioId, limite });
        
        return results.map(result => {
            const autorData = result.a.properties;
            return new Autor({
                id: autorData.id,
                nombre: autorData.nombre,
                biografia: autorData.biografia
            });
        });
    }

    async obtenerUsuariosConGustosSimilares(usuarioId: string, limite: number = 5): Promise<string[]> {
        const query = `
            MATCH (u1:Usuario {id: $usuarioId})-[:ESCUCHA]->(c:Cancion)<-[:ESCUCHA]-(u2:Usuario)
            WHERE u1 <> u2
            WITH u2, count(*) as cancionesComunes
            ORDER BY cancionesComunes DESC
            LIMIT $limite
            RETURN u2.id as usuarioId
        `;
        
        const results = await executeQuery<{usuarioId: string}>(query, { usuarioId, limite });
        return results.map(result => result.usuarioId);
    }

    async obtenerTendencias(limite: number = 10): Promise<Cancion[]> {
        const query = `
            MATCH (u:Usuario)-[:ESCUCHA]->(c:Cancion)
            WITH c, count(*) as reproducciones
            ORDER BY reproducciones DESC
            LIMIT $limite
            RETURN c
        `;
        
        const results = await executeQuery<{c: any}>(query, { limite });
        
        return results.map(result => {
            const cancionData = result.c.properties;
            return new Cancion({
                id: cancionData.id,
                titulo: cancionData.titulo,
                duracion: cancionData.duracion,
                autorId: cancionData.autorId,
                generoId: cancionData.generoId,
                fechaLanzamiento: new Date(cancionData.fechaLanzamiento)
            });
        });
    }
} 