/**
 * Entidad Autor musical.
 * Solo almacena datos esenciales y usa IDs para relaciones.
 */
export class Autor {
    private readonly id: string;
    private nombre: string;
    private biografia?: string;
    private generos: string[]; // IDs de géneros

    constructor(params: { id: string; nombre: string; biografia?: string; generos?: string[] }) {
        this.id = params.id;
        this.nombre = params.nombre;
        this.biografia = params.biografia;
        this.generos = params.generos ?? [];
    }

    getId(): string {
        return this.id;
    }

    getNombre(): string {
        return this.nombre;
    }

    setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    getBiografia(): string | undefined {
        return this.biografia;
    }

    setBiografia(bio: string): void {
        this.biografia = bio;
    }

    getGeneros(): string[] {
        return [...this.generos];
    }

    agregarGenero(generoId: string): void {
        if (!this.generos.includes(generoId)) {
            this.generos.push(generoId);
        }
    }

    quitarGenero(generoId: string): void {
        this.generos = this.generos.filter(id => id !== generoId);
    }
}

/**
 * Error personalizado para la entidad Autor.
 */
export class AutorError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AutorError";
    }
}