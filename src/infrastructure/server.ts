import express from "express";
import { AuthController } from "../interface-adapters/controllers/AuthController";
import { UsuarioRepositoryMemoria } from "./repositories/UsuarioRepositoryMemoria";

const app = express();
app.use(express.json());

// Instancia de repositorio en memoria y controlador
const usuarioRepo = new UsuarioRepositoryMemoria();
const authController = new AuthController(usuarioRepo);

// Endpoint para registro de usuario
app.post("/api/registro", async (req, res) => {
    try {
        const usuario = await authController.crearCuenta(req.body);
        res.status(201).json(usuario);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

// Endpoint para login
app.post("/api/login", async (req, res) => {
    try {
        const usuario = await authController.iniciarSesion(req.body);
        res.status(200).json(usuario);
    } catch (e: any) {
        res.status(401).json({ error: e.message });
    }
});

// Endpoint para validar credenciales
app.post("/api/validar", async (req, res) => {
    try {
        const valido = await authController.validarCredenciales(req.body);
        res.status(200).json({ valido });
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

// Endpoint para recuperar contraseña
app.post("/api/recuperar", async (req, res) => {
    try {
        await authController.recuperarPassword(req.body);
        res.status(200).json({ mensaje: "Contraseña actualizada" });
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});