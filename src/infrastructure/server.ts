// Temporalmente comentado para evitar errores de TypeScript
// Este archivo será usado cuando se implemente el servidor Express completo

/*
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

    }
});

// Endpoint para login
app.post("/api/login", async (req, res) => {
    try {
        const usuario = await authController.iniciarSesion(req.body);
        res.status(200).json(usuario);


// Endpoint para validar credenciales
app.post("/api/validar", async (req, res) => {
    try {
        const valido = await authController.validarCredenciales(req.body);
        res.status(200).json({ valido });


// Endpoint para recuperar contraseña
app.post("/api/recuperar", async (req, res) => {
    try {
        await authController.recuperarPassword(req.body);
  

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
*/