/**
 * Tipos de rol de usuario.
 */
export type RolUsuario = "invitado" | "usuario" | "admin";

/**
 * Preferencias del usuario, usando solo IDs para reducir acoplamiento.
 */
export interface PreferenciasUsuario {
    generosFavoritos: string[]; // IDs de género
    artistasFavoritos: string[]; // IDs de autor
}

/**
 * Entidad Usuario.
 */
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
            if (!this.nombre) throw new UsuarioError("El nombre es requerido para usuarios registrados.");
            if (!this.email) throw new UsuarioError("El email es requerido para usuarios registrados.");
            if (!this.contraseñaHash) throw new UsuarioError("La contraseña es requerida para usuarios registrados.");
            if (!this.fechaRegistro) throw new UsuarioError("La fecha de registro es requerida para usuarios registrados.");
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
            throw new UsuarioError("La nueva contraseña debe tener al menos 6 caracteres.");
        }
        this.contraseñaHash = nuevoHash;
    }

    cambiarNombre(nuevoNombre: string) {
        if (!nuevoNombre || nuevoNombre.length < 2) {
            throw new UsuarioError("El nombre debe tener al menos 2 caracteres.");
        }
        this.nombre = nuevoNombre;
    }

    cambiarEmail(nuevoEmail: string) {
        // Validación simple de email
        if (!nuevoEmail || !nuevoEmail.includes("@")) {
            throw new UsuarioError("El email no es válido.");
        }
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

    /**
     * Agrega un autor favorito por ID.
     */
    agregarAutorFavorito(autorId: string) {
        if (!this.preferencias) this.preferencias = { generosFavoritos: [], artistasFavoritos: [] };
        if (!this.preferencias.artistasFavoritos.includes(autorId)) {
            this.preferencias.artistasFavoritos.push(autorId);
        }
    }

    /**
     * Quita un autor favorito por ID.
     */
    quitarAutorFavorito(autorId: string) {
        if (!this.preferencias) return;
        this.preferencias.artistasFavoritos = this.preferencias.artistasFavoritos.filter(id => id !== autorId);
    }

    /**
     * Agrega un género favorito por ID.
     */
    agregarGeneroFavorito(generoId: string) {
        if (!this.preferencias) this.preferencias = { generosFavoritos: [], artistasFavoritos: [] };
        if (!this.preferencias.generosFavoritos.includes(generoId)) {
            this.preferencias.generosFavoritos.push(generoId);
        }
    }

    /**
     * Quita un género favorito por ID.
     */
    quitarGeneroFavorito(generoId: string) {
        if (!this.preferencias) return;
        this.preferencias.generosFavoritos = this.preferencias.generosFavoritos.filter(id => id !== generoId);
    }
}

/**
 * Error personalizado para la entidad Usuario.
 */
export class UsuarioError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UsuarioError";
    }
}