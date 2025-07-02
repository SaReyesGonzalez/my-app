/**
 * Entidad Género musical.
 * Puede usarse como enum o entidad simple.
 */
export class Genero {
    private readonly id: string;
    private nombre: string;
    private descripcion?: string;

    constructor(params: { id: string; nombre: string; descripcion?: string }) {
        this.id = params.id;
        this.nombre = params.nombre;
        this.descripcion = params.descripcion;
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

    getDescripcion(): string | undefined {
        return this.descripcion;
    }

    setDescripcion(desc: string): void {
        this.descripcion = desc;
    }
}

/**
 * Error personalizado para la entidad Genero.
 */
export class GeneroError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GeneroError";
    }
}