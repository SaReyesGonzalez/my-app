import { ObjectId } from 'mongodb';
import { CancionMongo, CancionParaCrear } from '../../models/Cancion';
import clientPromise from '../../lib/db/mongodb';

export class CancionRepositoryMongo {
    
    async crear(cancion: CancionParaCrear): Promise<string> {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const nuevaCancion: CancionMongo = {
            ...cancion,
            reproducciones: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection('canciones').insertOne(nuevaCancion);
        return result.insertedId.toString();
    }
    
    async buscarPorId(id: string): Promise<CancionMongo | null> {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const result = await db.collection('canciones').findOne({ _id: new ObjectId(id) });
        return result as CancionMongo | null;
    }
    
    async buscarPorTitulo(titulo: string): Promise<CancionMongo[]> {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const result = await db.collection('canciones')
            .find({ titulo: { $regex: titulo, $options: 'i' } })
            .toArray();
        return result as CancionMongo[];
    }
    
    async buscarPorAutor(autorId: string): Promise<CancionMongo[]> {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const result = await db.collection('canciones')
            .find({ autorId })
            .toArray();
        return result as CancionMongo[];
    }
    
    async buscarPorGenero(generoId: string): Promise<CancionMongo[]> {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const result = await db.collection('canciones')
            .find({ generoId })
            .toArray();
        return result as CancionMongo[];
    }
    
    async obtenerTendencias(limite: number = 10): Promise<CancionMongo[]> {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const result = await db.collection('canciones')
            .find()
            .sort({ reproducciones: -1 })
            .limit(limite)
            .toArray();
        return result as CancionMongo[];
    }
    
    async incrementarReproducciones(id: string): Promise<void> {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        await db.collection('canciones').updateOne(
            { _id: new ObjectId(id) },
            { 
                $inc: { reproducciones: 1 },
                $set: { updatedAt: new Date() }
            }
        );
    }
    
    async actualizar(id: string, datos: Partial<CancionMongo>): Promise<void> {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        await db.collection('canciones').updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    ...datos,
                    updatedAt: new Date()
                }
            }
        );
    }
    
    async eliminar(id: string): Promise<void> {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        await db.collection('canciones').deleteOne({ _id: new ObjectId(id) });
    }
    
    async obtenerTodas(limite: number = 50, offset: number = 0): Promise<CancionMongo[]> {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const result = await db.collection('canciones')
            .find()
            .skip(offset)
            .limit(limite)
            .toArray();
        return result as CancionMongo[];
    }
} 