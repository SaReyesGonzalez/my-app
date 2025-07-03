import express from "express";
import { AuthController } from "../interface-adapters/controllers/AuthController";
import { UsuarioRepositoryMemoria } from "./repositories/UsuarioRepositoryMemoria";
import { ContenidoRepositoryMemoria } from "./repositories/ContenidoRepositoryMemoria";
import { PlaylistRepositoryMemoria } from "./repositories/PlaylistRepositoryMemoria";
import { ContenidoController } from "../interface-adapters/controllers/ContenidoController";
import { PlaylistController } from "../interface-adapters/controllers/PlaylistController";
import { UsuarioController } from "../interface-adapters/controllers/UsuarioController";

const app = express();
app.use(express.json());

// Instancia de repositorio en memoria y controlador
const usuarioRepo = new UsuarioRepositoryMemoria();
const authController = new AuthController(usuarioRepo);
const usuarioController = new UsuarioController(usuarioRepo);

// Instancias de repositorios y controladores
const contenidoRepo = new ContenidoRepositoryMemoria();
const playlistRepo = new PlaylistRepositoryMemoria();
const contenidoController = new ContenidoController(contenidoRepo);
const playlistController = new PlaylistController(playlistRepo);

// Endpoint para registro de usuario
app.post("/api/registro", async (req, res) => {
    try {
        const usuario = await authController.crearCuenta(req.body);
        res.status(201).json(usuario);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error desconocido";
        res.status(400).json({ error: message });
    }
});

// Endpoint para login
app.post("/api/login", async (req, res) => {
    try {
        const usuario = await authController.iniciarSesion(req.body);
        res.status(200).json(usuario);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error desconocido";
        res.status(401).json({ error: message });
    }
});

// Endpoint para validar credenciales
app.post("/api/validar", async (req, res) => {
    try {
        const valido = await authController.validarCredenciales(req.body);
        res.status(200).json({ valido });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error desconocido";
        res.status(400).json({ error: message });
    }
});

// Endpoint para recuperar contraseña
app.post("/api/recuperar", async (req, res) => {
    try {
        await authController.recuperarPassword(req.body);
        res.status(200).json({ mensaje: "Contraseña actualizada" });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error desconocido";
        res.status(400).json({ error: message });
    }
});

// --- ENDPOINTS DE USUARIO (favoritos, historial, preferencias) ---
app.post("/api/usuario/favoritos", async (req, res) => {
    try {
        await usuarioController.guardarFavoritos(req.body);
        res.status(200).json({ mensaje: "Favorito guardado" });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error desconocido";
        res.status(400).json({ error: message });
    }
});
app.post("/api/usuario/historial", async (req, res) => {
    try {
        await usuarioController.historialReproducciones(req.body);
        res.status(200).json({ mensaje: "Historial actualizado" });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error desconocido";
        res.status(400).json({ error: message });
    }
});
app.post("/api/usuario/preferencias", async (req, res) => {
    try {
        await usuarioController.preferenciasUsuarios(req.body);
        res.status(200).json({ mensaje: "Preferencias actualizadas" });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error desconocido";
        res.status(400).json({ error: message });
    }
});

// --- ENDPOINTS DE CONTENIDO ---
app.get("/api/contenido/buscar", async (req, res) => {
    try {
        const resultados = await contenidoController.buscarContenido({ query: req.query.q as string });
        res.status(200).json(resultados);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error desconocido";
        res.status(400).json({ error: message });
    }
});
app.get("/api/contenido/ranking", async (req, res) => {
    try {
        const resultados = await contenidoController.explorarRanking({ generoId: req.query.generoId as string });
        res.status(200).json(resultados);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error desconocido";
        res.status(400).json({ error: message });
    }
});
app.get("/api/contenido/:id", async (req, res) => {
    try {
        const media = await contenidoController.reproducirContenido({ id: req.params.id });
        res.status(200).json(media);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error desconocido";
        res.status(404).json({ error: message });
    }
});

// --- ENDPOINTS DE PLAYLIST ---
app.post("/api/playlist", async (req, res) => {
    try {
        await playlistController.crearPlaylist(req.body);
        res.status(201).json({ mensaje: "Playlist creada" });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error desconocido";
        res.status(400).json({ error: message });
    }
});
app.put("/api/playlist", async (req, res) => {
    try {
        await playlistController.modificarPlaylist(req.body);
        res.status(200).json({ mensaje: "Playlist modificada" });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error desconocido";
        res.status(400).json({ error: message });
    }
});
app.delete("/api/playlist/:id", async (req, res) => {
    try {
        await playlistController.eliminarPlaylist({ id: req.params.id });
        res.status(200).json({ mensaje: "Playlist eliminada" });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error desconocido";
        res.status(400).json({ error: message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});