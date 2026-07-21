// ======================================================
// CONTROLADOR DE AUTENTICACIÓN
// ======================================================
//
// Este archivo contiene toda la lógica relacionada con:
//
// ✔ Registro de usuarios
// ✔ Inicio de sesión
// ✔ Generación del JWT
// ✔ Cookie HttpOnly

// ======================================================

// Importa la conexión a la base de datos
const db = require("../config/database");

// Librería para cifrar contraseñas
const bcrypt = require("bcrypt");

// Librería para crear JWT
const jwt = require("jsonwebtoken");

// Obtiene la clave secreta desde el archivo .env
const SECRET = process.env.JWT_SECRET;

// ======================================================
// REGISTRAR UN NUEVO USUARIO
// ======================================================

async function register(req, res) {

    // Obtiene los datos enviados desde el frontend
    const { nombre, usuario, password, idRol } = req.body;

    // ==========================================
    // VALIDACIÓN DE DATOS
    // ==========================================

    // Verifica que ningún campo venga vacío
    if (!nombre || !usuario || !password || !idRol) {

        return res.status(400).json({

            message: "Todos los campos son obligatorios."

        });

    }

    // Verifica que la contraseña tenga al menos 8 caracteres
    if (password.length < 8) {

        return res.status(400).json({

            message: "La contraseña debe tener mínimo 8 caracteres."

        });

    }

    try {

        // Encripta la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Consulta SQL utilizando parámetros para evitar SQL Injection
        const sql = `
            INSERT INTO Usuarios
            (Nombre, Usuario, Password, idRol)
            VALUES (?, ?, ?, ?)
        `;

        db.run(
            sql,
            [nombre, usuario, hashedPassword, idRol],

            function (err) {

                if (err) {

                    if (err.message.includes("UNIQUE")) {

                        return res.status(400).json({

                            message: "Ese usuario ya existe."

                        });

                    }

                    return res.status(500).json({

                        message: "Error al registrar el usuario."

                    });

                }

                return res.status(201).json({

                    message: "Usuario registrado correctamente.",

                    idUsuario: this.lastID

                });

            }

        );

    } catch (error) {

        return res.status(500).json({

            message: "Error interno del servidor."

        });

    }

}

// ======================================================
// INICIAR SESIÓN
// ======================================================

async function login(req, res) {

    // Obtiene el usuario y la contraseña enviados desde el frontend
    const { usuario, password } = req.body;

    // Verifica que ambos campos estén presentes
    if (!usuario || !password) {

        return res.status(400).json({

            message: "Usuario y contraseña son obligatorios."

        });

    }

    // Busca al usuario en la base de datos
    const sql = "SELECT * FROM Usuarios WHERE Usuario = ?";

    db.get(sql, [usuario], async (err, user) => {

        // Error al consultar la base de datos
        if (err) {

            return res.status(500).json({

                message: "Error interno del servidor."

            });

        }

        // El usuario no existe
        if (!user) {

            return res.status(401).json({

                message: "Usuario o contraseña incorrectos."

            });

        }

        // Compara la contraseña escrita con la contraseña cifrada
        const passwordValido = await bcrypt.compare(password, user.Password);

        // Si la contraseña no coincide
        if (!passwordValido) {

            return res.status(401).json({

                message: "Usuario o contraseña incorrectos."

            });

        }

        // ==================================================
        // AQUÍ COMIENZA JWT
        // ==================================================

        // Crea el token con la información necesaria del usuario
        const token = jwt.sign(

            {

                idUsuario: user.idUsuario,
                nombre: user.Nombre,
                usuario: user.Usuario,
                idRol: user.idRol

            },

            SECRET,

            {

                expiresIn: "2h"

            }

        );

        // Guarda el token en una Cookie HttpOnly
        res.cookie("token", token, {

            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 2 * 60 * 60 * 1000

        });

        // Respuesta correcta
        return res.status(200).json({

            message: "Inicio de sesión correcto.",

            user: {

                idUsuario: user.idUsuario,
                nombre: user.Nombre,
                usuario: user.Usuario,
                idRol: user.idRol

            }

        });

    });

}

function obtenerUsuario(req, res) {

    return res.status(200).json({

        usuario: req.usuario

    });

}

// ======================================================
// EXPORTAR LAS FUNCIONES DEL CONTROLADOR
// ======================================================

// Permite que otros archivos utilicen las funciones
// de este controlador.
module.exports = {

    register,

    login,

    obtenerUsuario

};