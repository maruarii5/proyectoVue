// ======================================================
// RUTAS DE AUTENTICACIÓN
// ======================================================
// Este archivo recibe las peticiones relacionadas
// con la autenticación y las envía al controlador.
// ======================================================

// Importa Express
const express = require("express");

// Crea el objeto Router
const router = express.Router();

// Importa el controlador de autenticación
const authController = require("../controllers/authController");

// Middleware que verifica si el usuario tiene un JWT válido
const verificarToken = require("../middleware/authMiddleware");

// ======================================================
// RUTAS
// ======================================================

// Registro de usuarios
router.post("/register", authController.register);

// Inicio de sesión
router.post("/login", authController.login);
// Devuelve la información del usuario autenticado
router.get(
    "/me",
    verificarToken,
    authController.obtenerUsuario
);

// Exporta las rutas
module.exports = router;