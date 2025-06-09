import { Autor } from "./Autor";
import { Genero } from "./Genero";

export type RolUsuario = "invitado" | "usuario" | "admin";

export interface PreferenciasUsuario {
    generosFavoritos: Genero[];
    artistasFavoritos: Autor[];
}

export class Usuario {
    private readonly id: string;
    private rol: RolUsuario;
    private nombre?: string;
    private email?: string;
    private contraseñaHash?: string;
    private fechaRegistro?: Date;
    private preferencias?: PreferenciasUsuario;

    constructor(params: {
        id: string;
        rol: RolUsuario;
        nombre?: string;
        email?: string;
        contraseñaHash?: string;
        fechaRegistro?: Date;
        preferencias?: PreferenciasUsuario;
    }) {
        this.id = params.id;
        this.rol = params.rol;
        this.nombre = params.nombre;
        this.email = params.email;
        this.contraseñaHash = params.contraseñaHash;
        this.fechaRegistro = params.fechaRegistro;
        this.preferencias = params.preferencias;

        // Validación según rol
        if (this.rol !== "invitado") {
            if (!this.nombre) throw new Error("El nombre es requerido para usuarios registrados.");
            if (!this.email) throw new Error("El email es requerido para usuarios registrados.");
            if (!this.contraseñaHash) throw new Error("La contraseña es requerida para usuarios registrados.");
            if (!this.fechaRegistro) throw new Error("La fecha de registro es requerida para usuarios registrados.");
        }
    }

    // Getters
    getId() { return this.id; }
    getRol() { return this.rol; }
    getNombre() { return this.nombre; }
    getEmail() { return this.email; }
    getFechaRegistro() { return this.fechaRegistro; }
    getPreferencias() { return this.preferencias; }
    getContraseñaHash() { return this.contraseñaHash; }

    // Métodos de dominio
    cambiarContraseña(nuevoHash: string) {
        if (!nuevoHash || nuevoHash.length < 6) {
            throw new Error("La nueva contraseña debe tener al menos 6 caracteres.");
        }
        this.contraseñaHash = nuevoHash;
    }

    cambiarNombre(nuevoNombre: string) {
        if (!nuevoNombre || nuevoNombre.length < 2) {
            throw new Error("El nombre debe tener al menos 2 caracteres.");
        }
        this.nombre = nuevoNombre;
    }

    cambiarEmail(nuevoEmail: string) {
        // Aquí podrías añadir validación de formato de email
        this.email = nuevoEmail;
    }

    cambiarPreferencias(preferencias: PreferenciasUsuario) {
        this.preferencias = preferencias;
    }

    cambiarRol(nuevoRol: RolUsuario) {
        this.rol = nuevoRol;
    }

    esAdmin(): boolean {
        return this.rol === "admin";
    }
}