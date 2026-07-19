require("dotenv").config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
// Obtiene el puerto desde el archivo .env
const PORT = process.env.PORT;
const SECRET = process.env.JWT_SECRET;

app.use(cookieParser());

// Middlewares
app.use(cors({ // Permite que tu frontend en Vue se conecte sin problemas de CORS
    origin: "http://localhost:5173",
    credentials: true
    })); 
app.use(express.json()); // Permite recibir datos en formato JSON

// Conexión a la base de datos SQLite (se creará un archivo llamado escuela.db)
const db = new sqlite3.Database('./escuela.db', (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Conectado con éxito a la base de datos SQLite (escuela.db).');
    }
});

// Activar el soporte de Llaves Foráneas en SQLite
db.run("PRAGMA foreign_keys = ON;");

// Inicialización de las tablas
db.serialize(() => {
    // 1. ESTADOS
    db.run(`CREATE TABLE IF NOT EXISTS Estados (
        idEstado INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL
    )`);

    // 2. MUNICIPIOS
    db.run(`CREATE TABLE IF NOT EXISTS Municipios (
        idMunicipio INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL,
        idEstado INTEGER NOT NULL,
        FOREIGN KEY (idEstado) REFERENCES Estados(idEstado) ON UPDATE CASCADE ON DELETE RESTRICT
    )`);

    // 3. LOCALIDADES
    db.run(`CREATE TABLE IF NOT EXISTS Localidades (
        idLocalidad INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL,
        idMunicipio INTEGER NOT NULL,
        FOREIGN KEY (idMunicipio) REFERENCES Municipios(idMunicipio) ON UPDATE CASCADE ON DELETE RESTRICT
    )`);

    // 4. GENEROS
    db.run(`CREATE TABLE IF NOT EXISTS Generos (
        idGenero INTEGER PRIMARY KEY AUTOINCREMENT,
        Genero TEXT NOT NULL
    )`);

    // 5. DATOS PERSONALES
    db.run(`CREATE TABLE IF NOT EXISTS DatosPersonales (
        idDatosP INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL,
        FechaNacimiento TEXT,
        Curp TEXT UNIQUE,
        Email TEXT,
        Telefono TEXT,
        Calle TEXT,
        NumE INTEGER,
        NumI INTEGER,
        CP INTEGER,
        idLocalidad INTEGER,
        idMunicipio INTEGER,
        idEstado INTEGER,
        idGenero INTEGER,
        FOREIGN KEY (idLocalidad) REFERENCES Localidades(idLocalidad),
        FOREIGN KEY (idMunicipio) REFERENCES Municipios(idMunicipio),
        FOREIGN KEY (idEstado) REFERENCES Estados(idEstado),
        FOREIGN KEY (idGenero) REFERENCES Generos(idGenero)
    )`);

    // 6. TIPO PERSONAL
    db.run(`CREATE TABLE IF NOT EXISTS TipoPersonal (
        idTipo INTEGER PRIMARY KEY AUTOINCREMENT,
        Personal TEXT NOT NULL
    )`);

    // 7. PERSONAL
    db.run(`CREATE TABLE IF NOT EXISTS Personal (
        idPersonal INTEGER PRIMARY KEY AUTOINCREMENT,
        idDatosP INTEGER NOT NULL,
        idTipo INTEGER NOT NULL,
        ClaveEmp TEXT NOT NULL,
        Status INTEGER DEFAULT 1,
        FOREIGN KEY (idDatosP) REFERENCES DatosPersonales(idDatosP),
        FOREIGN KEY (idTipo) REFERENCES TipoPersonal(idTipo)
    )`);

    // 8. CARRERAS
    db.run(`CREATE TABLE IF NOT EXISTS Carreras (
        idCarrera INTEGER PRIMARY KEY AUTOINCREMENT,
        NombreCarreras TEXT NOT NULL,
        Estatus INTEGER DEFAULT 1
    )`);

    // 9. ALUMNOS
    db.run(`CREATE TABLE IF NOT EXISTS Alumnos (
        Matricula TEXT PRIMARY KEY,
        idCarrera INTEGER NOT NULL,
        idDatosP INTEGER NOT NULL,
        Status TEXT DEFAULT 'A',
        FOREIGN KEY (idCarrera) REFERENCES Carreras(idCarrera),
        FOREIGN KEY (idDatosP) REFERENCES DatosPersonales(idDatosP)
    )`);

    // 10. ASIGNATURAS
    db.run(`CREATE TABLE IF NOT EXISTS Asignaturas (
        idAsignatura INTEGER PRIMARY KEY AUTOINCREMENT,
        NombresMaterias TEXT NOT NULL,
        HorasTotales INTEGER NOT NULL
    )`);

    // 11. INTENDENCIA
    db.run(`CREATE TABLE IF NOT EXISTS Intendencia (
        idEmpleado INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL,
        Telefono TEXT,
        Area TEXT,
        Turno TEXT
    )`);

    // 12. DATOS ESCUELA
    db.run(`CREATE TABLE IF NOT EXISTS DatosEscuela (
        CCT TEXT PRIMARY KEY,
        Nombre TEXT NOT NULL,
        Telefono TEXT,
        Email TEXT,
        Calle TEXT,
        NumE INTEGER,
        NumI INTEGER,
        idLocalidad INTEGER,
        idMunicipio INTEGER,
        idEstado INTEGER,
        CP INTEGER,
        FOREIGN KEY (idLocalidad) REFERENCES Localidades(idLocalidad),
        FOREIGN KEY (idMunicipio) REFERENCES Municipios(idMunicipio),
        FOREIGN KEY (idEstado) REFERENCES Estados(idEstado)
    )`);

    // ==========================================
    // NUEVAS TABLAS: ROLES Y USUARIOS
    // ==========================================
    
    // 13. TABLA ROLES
    db.run(`CREATE TABLE IF NOT EXISTS Roles (
        idRol INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL UNIQUE
    )`, () => {
        // Insertar roles por defecto si la tabla está vacía para que no tire error al registrar
        db.get("SELECT COUNT(*) as count FROM Roles", [], (err, row) => {
            if (row && row.count === 0) {
                db.run("INSERT INTO Roles (Nombre) VALUES ('Administrador'), ('Usuario')");
            }
        });
    });

    // 14. TABLA USUARIOS (Con validación de correo único)
    db.run(`CREATE TABLE IF NOT EXISTS Usuarios (
        idUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL,
        Usuario TEXT NOT NULL UNIQUE, 
        Password TEXT NOT NULL,
        idRol INTEGER NOT NULL,
        FOREIGN KEY (idRol) REFERENCES Roles(idRol)
    )`);
});

// ==========================================
// ENDPOINTS DE AUTENTICACIÓN
// ==========================================

// 1. ENDPOINT PARA REGISTRAR UN USUARIO
app.post('/register', async (req, res) => {
    const { nombre, usuario, password, idRol } = req.body;

    // Validación en el servidor por seguridad
    if (!nombre || !usuario || !password || !idRol) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'La contraseña debe tener mínimo 8 caracteres.' });
    }

    try {
        // Encriptar la contraseña antes de guardarla en la base de datos
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = `INSERT INTO Usuarios (Nombre, Usuario, Password, idRol) VALUES (?, ?, ?, ?)`;
        
        db.run(sql, [nombre, usuario, hashedPassword, idRol], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ message: 'Este correo electrónico ya está registrado.' });
                }
                return res.status(500).json({ message: 'Error al registrar en la base de datos.' });
            }
            res.status(201).json({ message: '¡Cuenta creada con éxito!', idUsuario: this.lastID });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// 2. ENDPOINT PARA INICIAR SESIÓN
app.post('/login', (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ message: 'Por favor, introduce usuario y contraseña.' });
    }

    const sql = `SELECT * FROM Usuarios WHERE Usuario = ?`;

    db.get(sql, [usuario], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor.' });
        }
        
        if (!user) {
            return res.status(400).json({ message: 'El usuario o la contraseña no coinciden.' });
        }

        // Comparar la contraseña ingresada con el hash guardado en la base de datos
        const validPassword = await bcrypt.compare(password, user.Password);
        
        if (!validPassword) {
            return res.status(400).json({ message: 'El usuario o la contraseña no coinciden.' });
        }

        
    // CODIFICACIÓN SEGURA #5 AUTENTICACIÓN MEDIANTE JWT
    // el servidor crea una credencial digital (JWT)

        const payload = {
            idUsuario: user.idUsuario,
            nombre: user.Nombre,
            usuario: user.Usuario,
            idRol: user.idRol
            };

        // Crear el JWT usando la clave secreta del archivo .env
        const token = jwt.sign(
            payload,
            SECRET,
            {
                expiresIn: "1h" // Durará una hora
            }
        );

        // Guardar el JWT dentro de una Cookie HttpOnly.
        res.cookie("token", token, {
            httpOnly: true,

            // En producción deberá ser true.
            secure: false,

            sameSite: "Strict",

            maxAge: 60 * 60 * 1000 // 1 hora
        });

        // Respuesta para Vue
        res.status(200).json({

            message: "¡Inicio de sesión correcto!",

            user: payload

        });
    });
});


// ==========================================
// CRUD: TABLA ESTADOS
// ==========================================

// Leer todos los estados (READ)
app.get('/api/estados', (req, res) => {
    db.all("SELECT * FROM Estados", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Agregar un nuevo estado (CREATE)
app.post('/api/estados', (req, res) => {
    const { Nombre } = req.body;
    db.run("INSERT INTO Estados (Nombre) VALUES (?)", [Nombre], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ idEstado: this.lastID, Nombre });
    });
});

// Actualizar un estado (UPDATE)
app.put('/api/estados/:id', (req, res) => {
    const { Nombre } = req.body;
    const { id } = req.params;
    db.run("UPDATE Estados SET Nombre = ? WHERE idEstado = ?", [Nombre, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Estado actualizado" });
    });
});

// Eliminar un estado (DELETE)
app.delete('/api/estados/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM Estados WHERE idEstado = ?", [id], function (err) {
        if (err) {
            if (err.message.includes('FOREIGN KEY')) {
                return res.status(400).json({ error: "No puedes borrar este estado porque tiene municipios asignados." });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Estado eliminado" });
    });
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo correctamente en http://localhost:${PORT}`);
});