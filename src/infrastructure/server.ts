// Temporalmente comentado para evitar errores de TypeScript
// Este archivo será usado cuando se implemente el servidor Express completo

/*
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
    } catch (e: unknown) {
        const error = e instanceof Error ? e.message : 'Error desconocido';
        res.status(400).json({ error });
    }
});

// Endpoint para login
app.post("/api/login", async (req, res) => {
    try {
        const usuario = await authController.iniciarSesion(req.body);
        res.status(200).json(usuario);
    } catch (e: unknown) {
        const error = e instanceof Error ? e.message : 'Error desconocido';
        res.status(401).json({ error });
    }
});

// Endpoint para validar credenciales
app.post("/api/validar", async (req, res) => {
    try {
        const valido = await authController.validarCredenciales(req.body);
        res.status(200).json({ valido });
    } catch (e: unknown) {
        const error = e instanceof Error ? e.message : 'Error desconocido';
        res.status(400).json({ error });
    }
});

// Endpoint para recuperar contraseña
app.post("/api/recuperar", async (req, res) => {
    try {
        await authController.recuperarPassword(req.body);
        res.status(200).json({ mensaje: "Contraseña actualizada" });
    } catch (e: unknown) {
        const error = e instanceof Error ? e.message : 'Error desconocido';
        res.status(400).json({ error });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
*/