
// Este archivo verifica que el usuario haya iniciado sesión correctamente mediante un JWT

// Librería para verificar JWT
const jwt = require("jsonwebtoken");

// Obtiene la clave secreta desde el archivo .env
const SECRET = process.env.JWT_SECRET;

function verificarToken(req, res, next) {

    // Obtiene el token almacenado en la Cookie HttpOnly
    const token = req.cookies.token;

    // Si no existe la cookie...
    if (!token) {

        return res.status(401).json({

            message: "Acceso denegado. Debes iniciar sesión."

        });

    }

    // Verifica que el JWT sea válido
    jwt.verify(token, SECRET, (err, usuario) => {

        if (err) {

            return res.status(403).json({

                message: "La sesión ha expirado o el token no es válido."

            });

        }

        // Guarda la información del usuario para utilizarla en otras rutas
        req.usuario = usuario;

        // Continúa hacia el endpoint solicitado
        next();

    });

}

// Exporta el middleware
module.exports = verificarToken;