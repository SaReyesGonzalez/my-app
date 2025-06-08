export class Genero {
    private id: string;
    private nombre: string;

    constructor(id: string, nombre: string) {
        this.id = id;
        this.nombre = nombre;
    }

    getId(): string {
        return this.id;
    }

    getNombre(): string {
        return this.nombre;
    }
}