import { Cancion } from "./Cancion";

export abstract class ArrayMusica {
    private id: string;
    private nombre: string;
    private canciones: Cancion[];
    private portada: string;

    constructor(params: {
        id: string;
        nombre: string;
        canciones: Cancion[];
        portada?: string;
    }) {
        this.id = params.id;
        this.nombre = params.nombre;
        this.canciones = params.canciones;
        this.portada = params.portada || "";
    }

    getId(): string {
        return this.id;
    }
    getNombre(): string {
        return this.nombre;
    }
    getCanciones(): Cancion[] {
        return this.canciones;
    }
    getPortada(): string {
        return this.portada;
    }

    setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    setPortada(portada: string): void {
        this.portada = portada;
    }

    addCancion(cancion: Cancion): void {
        this.canciones.push(cancion);
    }

    removeCancion(cancionId: string): void {
        this.canciones = this.canciones.filter(c => c.getId() !== cancionId);
    }


}