require("dotenv").config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// Importa las rutas relacionadas con la autenticación
const authRoutes = require("./routes/authRoutes");

// Importa la conexión a SQLite desde el archivo database.js
const db = require("./config/database");

const app = express();
// Obtiene el puerto desde el archivo .env
const PORT = process.env.PORT;
const SECRET = process.env.JWT_SECRET;

app.use(cookieParser());

// Middlewares
// --- REEMPLAZA A PARTIR DE AQUÍ ---
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://proyecto-vue-sand.vercel.app",
        "https://proyecto-vue-git-main-lab-rats2.vercel.app"
    ],
    credentials: true
})); 
// --- HASTA AQUÍ ---

app.use(express.json()); // Permite recibir datos en formato JSON

app.use("/api/auth", authRoutes);

// Activar el soporte de Llaves Foráneas en SQLite
db.run("PRAGMA foreign_keys = ON;");

// Middlewares
app.use(cors({ // Permite que tu frontend en Vue se conecte sin problemas de CORS
    origin: "http://localhost:5173",
    credentials: true
    })); 
app.use(express.json()); // Permite recibir datos en formato JSON

app.use("/api/auth", authRoutes);

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


app.get("/api/debug/alumnos", (req, res) => {

    db.all("PRAGMA table_info(Alumnos)", [], (err, rows) => {

        if (err) {

            return res.json(err);

        }

        res.json(rows);

    });

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
// ESTADOS
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


// ======================================================
// MUNICIPIOS
// ======================================================

// Obtener todos los municipios con el nombre del estado
app.get("/api/municipios", (req, res) => {

    const sql = `
        SELECT
            M.idMunicipio,
            M.Nombre,
            M.idEstado,
            E.Nombre AS Estado
        FROM Municipios M
        INNER JOIN Estados E
            ON M.idEstado = E.idEstado
        ORDER BY E.Nombre, M.Nombre
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {

            return res.status(500).json({
                error: err.message
            });

        }

        res.json(rows);

    });

});

// Agregar municipio
app.post("/api/municipios", (req, res) => {

    const { Nombre, idEstado } = req.body;

    db.run(

        "INSERT INTO Municipios (Nombre,idEstado) VALUES (?,?)",

        [Nombre, idEstado],

        function (err) {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json({

                idMunicipio: this.lastID,

                Nombre,

                idEstado

            });

        }

    );

});

// Actualizar municipio
app.put("/api/municipios/:id", (req, res) => {

    const { id } = req.params;

    const { Nombre, idEstado } = req.body;

    db.run(

        "UPDATE Municipios SET Nombre=?, idEstado=? WHERE idMunicipio=?",

        [Nombre, idEstado, id],

        function (err) {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json({

                message: "Municipio actualizado."

            });

        }

    );

});

// Eliminar municipio
app.delete("/api/municipios/:id", (req, res) => {

    const { id } = req.params;

    db.run(

        "DELETE FROM Municipios WHERE idMunicipio=?",

        [id],

        function (err) {

            if (err) {

                if (err.message.includes("FOREIGN")) {

                    return res.status(400).json({

                        error: "No puedes eliminar este municipio porque tiene localidades relacionadas."

                    });

                }

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json({

                message: "Municipio eliminado."

            });

        }

    );

});


// ===============================
// LOCALIDADES
// ===============================

// Obtener todas las localidades
app.get("/api/localidades", (req, res) => {

    const sql = `
        SELECT
            L.idLocalidad,
            L.Nombre,
            L.idMunicipio,
            M.Nombre AS Municipio,
            E.Nombre AS Estado
        FROM Localidades L
        INNER JOIN Municipios M
            ON L.idMunicipio = M.idMunicipio
        INNER JOIN Estados E
            ON M.idEstado = E.idEstado
        ORDER BY
            E.Nombre,
            M.Nombre,
            L.Nombre
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {

            return res.status(500).json({
                error: err.message
            });

        }

        res.json(rows);

    });

});

// Agregar localidad
app.post("/api/localidades", (req, res) => {

    const { Nombre, idMunicipio } = req.body;

    db.run(

        "INSERT INTO Localidades (Nombre,idMunicipio) VALUES (?,?)",

        [Nombre, idMunicipio],

        function (err) {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json({

                idLocalidad: this.lastID,

                Nombre,

                idMunicipio

            });

        }

    );

});

// Actualizar localidad
app.put("/api/localidades/:id", (req, res) => {

    const { id } = req.params;

    const { Nombre, idMunicipio } = req.body;

    db.run(

        "UPDATE Localidades SET Nombre=?, idMunicipio=? WHERE idLocalidad=?",

        [Nombre, idMunicipio, id],

        function (err) {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json({

                message: "Localidad actualizada."

            });

        }

    );

});

// Eliminar localidad
app.delete("/api/localidades/:id", (req, res) => {

    const { id } = req.params;

    db.run(

        "DELETE FROM Localidades WHERE idLocalidad=?",

        [id],

        function (err) {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json({

                message: "Localidad eliminada."

            });

        }

    );

});

//==========================================
// GENEROS
//==========================================

// Obtener todos
app.get("/api/generos", (req, res) => {

    db.all(

        "SELECT * FROM Generos ORDER BY Genero",

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json(rows);

        }

    );

});

// Agregar

app.post("/api/generos", (req, res) => {

    const { Genero } = req.body;

    db.run(

        "INSERT INTO Generos (Genero) VALUES (?)",

        [Genero],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                idGenero:this.lastID,

                Genero

            });

        }

    );

});

// Actualizar

app.put("/api/generos/:id",(req,res)=>{

    const {id}=req.params;

    const {Genero}=req.body;

    db.run(

        "UPDATE Generos SET Genero=? WHERE idGenero=?",

        [Genero,id],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Genero actualizado."

            });

        }

    );

});

// Eliminar

app.delete("/api/generos/:id",(req,res)=>{
    const {id}=req.params;

    db.run(

        "DELETE FROM Generos WHERE idGenero=?",

        [id],

        function(err){

            if(err){

                return res.status(500).json({
                    error:err.message
                });
            }

            res.json({
                message:"Genero eliminado."
            });

        }

    );

});



//==========================================
// TIPO DE PERSONAL
//==========================================

// Obtener tipos de personal
app.get("/api/tipopersonal", (req, res) => {

    db.all(

        `
        SELECT
            idTipo,
            Personal
        FROM TipoPersonal
        ORDER BY Personal
        `,

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json(rows);

        }

    );

});

// Agregar tipo de personal
app.post("/api/tipopersonal", (req, res) => {

    const { Personal } = req.body;

    db.run(

        "INSERT INTO TipoPersonal (Personal) VALUES (?)",

        [Personal],

        function (err) {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json({

                idTipo: this.lastID,

                Personal

            });

        }

    );

});

// Actualizar tipo de personal
app.put("/api/tipopersonal/:id", (req, res) => {

    const { id } = req.params;

    const { Personal } = req.body;

    db.run(

        "UPDATE TipoPersonal SET Personal=? WHERE idTipo=?",

        [

            Personal,

            id

        ],

        function (err) {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json({

                message: "Tipo de personal actualizado."

            });

        }

    );

});

// Eliminar tipo de personal
app.delete("/api/tipopersonal/:id", (req, res) => {

    const { id } = req.params;

    db.run(

        "DELETE FROM TipoPersonal WHERE idTipo=?",

        [id],

        function (err) {

            if (err) {

                if (err.message.includes("FOREIGN")) {

                    return res.status(400).json({

                        error: "No puedes eliminar este tipo de personal porque está siendo utilizado."

                    });

                }

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json({

                message: "Tipo de personal eliminado."

            });

        }

    );

});


//==========================================
// PERSONAL
//==========================================

// Obtener todo el personal
app.get("/api/personal", (req, res) => {

    const sql = `
        SELECT
            P.idPersonal,
            P.idDatosP,
            P.idTipo,
            P.ClaveEmp,
            P.Status,
            DP.Nombre AS Persona,
            TP.Personal AS Tipo
        FROM Personal P
        INNER JOIN DatosPersonales DP
            ON P.idDatosP = DP.idDatosP
        INNER JOIN TipoPersonal TP
            ON P.idTipo = TP.idTipo
        ORDER BY DP.Nombre
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {

            return res.status(500).json({
                error: err.message
            });

        }

        res.json(rows);

    });

});

// Obtener Personas
app.get("/api/personal/personas", (req, res) => {

    db.all(

        `
        SELECT
            idDatosP,
            Nombre
        FROM DatosPersonales
        ORDER BY Nombre
        `,

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json(rows);

        }

    );

});

// Obtener Tipos de Personal
app.get("/api/personal/tipos", (req, res) => {

    db.all(

        `
        SELECT
            idTipo,
            Personal
        FROM TipoPersonal
        ORDER BY Personal
        `,

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json(rows);

        }

    );

});

// Agregar Personal
app.post("/api/personal", (req, res) => {

    const {

        idDatosP,
        idTipo,
        ClaveEmp,
        Status

    } = req.body;

    db.run(

        `
        INSERT INTO Personal
        (
            idDatosP,
            idTipo,
            ClaveEmp,
            Status
        )
        VALUES (?,?,?,?)
        `,

        [

            idDatosP,
            idTipo,
            ClaveEmp,
            Status

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                idPersonal:this.lastID

            });

        }

    );

});

// Actualizar Personal
app.put("/api/personal/:id", (req, res) => {

    const { id } = req.params;

    const {

        idDatosP,
        idTipo,
        ClaveEmp,
        Status

    } = req.body;

    db.run(

        `
        UPDATE Personal
        SET

            idDatosP=?,
            idTipo=?,
            ClaveEmp=?,
            Status=?

        WHERE idPersonal=?
        `,

        [

            idDatosP,
            idTipo,
            ClaveEmp,
            Status,
            id

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Personal actualizado."

            });

        }

    );

});

// Eliminar Personal
app.delete("/api/personal/:id", (req, res) => {

    const { id } = req.params;

    db.run(

        "DELETE FROM Personal WHERE idPersonal=?",

        [id],

        function(err){

            if(err){

                if(err.message.includes("FOREIGN")){

                    return res.status(400).json({

                        error:"No es posible eliminar este registro."

                    });

                }

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Registro eliminado."

            });

        }

    );

});



//==========================================
// DATOS PERSONALES
//==========================================

// Obtener todos
app.get("/api/datospersonales", (req, res) => {

    const sql = `
        SELECT
            D.idDatosP, D.Nombre, D.FechaNacimiento, D.Curp, D.Email, D.Telefono, D.Calle, D.NumE,
            D.NumI, D.CP, D.idEstado, D.idMunicipio, D.idLocalidad, D.idGenero, E.Nombre AS Estado,
            M.Nombre AS Municipio, L.Nombre AS Localidad, G.Genero
        FROM DatosPersonales D
        LEFT JOIN Estados E
            ON D.idEstado = E.idEstado
        LEFT JOIN Municipios M
            ON D.idMunicipio = M.idMunicipio
        LEFT JOIN Localidades L
            ON D.idLocalidad = L.idLocalidad
        LEFT JOIN Generos G
            ON D.idGenero = G.idGenero
        ORDER BY D.Nombre
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {

            return res.status(500).json({

                error: err.message

            });

        }

        res.json(rows);

    });

});

// Estados
app.get("/api/datospersonales/estados", (req, res) => {

    db.all(

        "SELECT idEstado, Nombre FROM Estados ORDER BY Nombre",

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json(rows);

        }

    );

});

// Municipios
app.get("/api/datospersonales/municipios", (req, res) => {

    db.all(

        "SELECT idMunicipio, Nombre FROM Municipios ORDER BY Nombre",

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json(rows);

        }

    );

});

// Localidades
app.get("/api/datospersonales/localidades", (req, res) => {

    db.all(

        "SELECT idLocalidad, Nombre FROM Localidades ORDER BY Nombre",

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json(rows);

        }

    );

});

// Géneros
app.get("/api/datospersonales/generos", (req, res) => {

    db.all(

        "SELECT idGenero, Genero FROM Generos ORDER BY Genero",

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json(rows);

        }

    );

});

// Agregar Datos Personales
app.post("/api/datospersonales", (req, res) => {

    const {

        Nombre,
        FechaNacimiento,
        Curp,
        Email,
        Telefono,
        Calle,
        NumE,
        NumI,
        CP,
        idLocalidad,
        idMunicipio,
        idEstado,
        idGenero

    } = req.body;

    db.run(

        `INSERT INTO DatosPersonales
        (
            Nombre,
            FechaNacimiento,
            Curp,
            Email,
            Telefono,
            Calle,
            NumE,
            NumI,
            CP,
            idLocalidad,
            idMunicipio,
            idEstado,
            idGenero
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,

        [

            Nombre,
            FechaNacimiento,
            Curp,
            Email,
            Telefono,
            Calle,
            NumE,
            NumI,
            CP,
            idLocalidad,
            idMunicipio,
            idEstado,
            idGenero

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                idDatosP:this.lastID

            });

        }

    );

});

// Actualizar Datos Personales
app.put("/api/datospersonales/:id", (req, res) => {

    const { id } = req.params;

    const {

        Nombre,
        FechaNacimiento,
        Curp,
        Email,
        Telefono,
        Calle,
        NumE,
        NumI,
        CP,
        idLocalidad,
        idMunicipio,
        idEstado,
        idGenero

    } = req.body;

    db.run(

        `UPDATE DatosPersonales SET

            Nombre=?,
            FechaNacimiento=?,
            Curp=?,
            Email=?,
            Telefono=?,
            Calle=?,
            NumE=?,
            NumI=?,
            CP=?,
            idLocalidad=?,
            idMunicipio=?,
            idEstado=?,
            idGenero=?

        WHERE idDatosP=?`,

        [

            Nombre,
            FechaNacimiento,
            Curp,
            Email,
            Telefono,
            Calle,
            NumE,
            NumI,
            CP,
            idLocalidad,
            idMunicipio,
            idEstado,
            idGenero,
            id

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Datos personales actualizados."

            });

        }

    );

});

// Eliminar Datos Personales
app.delete("/api/datospersonales/:id", (req, res) => {

    const { id } = req.params;

    db.run(

        "DELETE FROM DatosPersonales WHERE idDatosP=?",

        [id],

        function(err){

            if(err){

                if(err.message.includes("FOREIGN")){

                    return res.status(400).json({

                        error:"No puedes eliminar este registro porque está relacionado con otros datos."

                    });

                }

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Registro eliminado."

            });

        }

    );

});


//==========================================
// CARRERAS
//==========================================

// Obtener todas las carreras
app.get("/api/carreras", (req, res) => {

    db.all(

        `
        SELECT
            idCarrera,
            NombreCarreras,
            Estatus
        FROM Carreras
        ORDER BY NombreCarreras
        `,

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json(rows);

        }

    );

});

// Agregar carrera
app.post("/api/carreras", (req, res) => {

    const {

        NombreCarreras,
        Estatus

    } = req.body;

    db.run(

        `
        INSERT INTO Carreras
        (
            NombreCarreras,
            Estatus
        )
        VALUES (?,?)
        `,

        [

            NombreCarreras,
            Estatus

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                idCarrera:this.lastID

            });

        }

    );

});

// Actualizar carrera
app.put("/api/carreras/:id", (req, res) => {

    const { id } = req.params;

    const {

        NombreCarreras,
        Estatus

    } = req.body;

    db.run(

        `
        UPDATE Carreras
        SET

            NombreCarreras=?,
            Estatus=?

        WHERE idCarrera=?
        `,

        [

            NombreCarreras,
            Estatus,
            id

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Carrera actualizada."

            });

        }

    );

});

// Eliminar carrera
app.delete("/api/carreras/:id", (req, res) => {

    const { id } = req.params;

    db.run(

        "DELETE FROM Carreras WHERE idCarrera=?",

        [id],

        function(err){

            if(err){

                if(err.message.includes("FOREIGN")){

                    return res.status(400).json({

                        error:"No es posible eliminar esta carrera porque tiene registros relacionados."

                    });

                }

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Carrera eliminada."

            });

        }

    );

});



//==========================================
// ALUMNOS
//==========================================

// Obtener alumnos
app.get("/api/alumnos", (req, res) => {

    const sql = `
        SELECT
            A.Matricula,
            A.idCarrera,
            A.idDatosP,
            A.Status,
            D.Nombre AS Alumno,
            C.NombreCarreras AS Carrera
        FROM Alumnos A
        INNER JOIN DatosPersonales D
            ON A.idDatosP = D.idDatosP
        INNER JOIN Carreras C
            ON A.idCarrera = C.idCarrera
        ORDER BY D.Nombre
    `;

    db.all(sql, [], (err, rows) => {

        if(err){

            return res.status(500).json({

                error:err.message

            });

        }

        res.json(rows);

    });

});

// Obtener personas
app.get("/api/alumnos/personas",(req,res)=>{

    db.all(

        `
        SELECT
            idDatosP,
            Nombre
        FROM DatosPersonales
        ORDER BY Nombre
        `,

        [],

        (err,rows)=>{

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json(rows);

        }

    );

});

// Obtener carreras
app.get("/api/alumnos/carreras",(req,res)=>{

    db.all(

        `
        SELECT
            idCarrera,
            NombreCarreras
        FROM Carreras
        ORDER BY NombreCarreras
        `,

        [],

        (err,rows)=>{

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json(rows);

        }

    );

});

// Agregar alumno
// Agregar alumno
app.post("/api/alumnos", (req, res) => {

    console.log("POST ALUMNOS:", req.body);

    console.log("BODY:", req.body);

    const {
        Matricula,
        idCarrera,
        idDatosP,
        Status
    } = req.body;

    const sql = `
        INSERT INTO Alumnos
        (
            Matricula,
            idCarrera,
            idDatosP,
            Status
        )
        VALUES (?,?,?,?)
    `;

    console.log(sql);

    db.run(
        sql,
        [
            Matricula,
            idCarrera,
            idDatosP,
            Status
        ],
        function(err){

            if(err){

                console.log("ERROR SQLITE:", err);

                return res.status(500).json({
                    error:err.message
                });

            }

            res.json({
                Matricula
            });

        }

    );

});


// Actualizar alumno
app.put("/api/alumnos/:id",(req,res)=>{

    const{id}=req.params;

    const{

        idCarrera,
        idDatosP,
        Status

    }=req.body;

    db.run(

        `
        UPDATE Alumnos
        SET

            idCarrera=?,
            idDatosP=?,
            Status=?

        WHERE Matricula=?
        `,

        [

            idCarrera,
            idDatosP,
            Status,
            id

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Alumno actualizado."

            });

        }

    );

});

// Eliminar alumno
app.delete("/api/alumnos/:id",(req,res)=>{

    const{id}=req.params;

    db.run(

        "DELETE FROM Alumnos WHERE Matricula=?",

        [id],

        function(err){

            if(err){

                if(err.message.includes("FOREIGN")){

                    return res.status(400).json({

                        error:"No es posible eliminar este alumno."

                    });

                }

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Alumno eliminado."

            });

        }

    );

});


//==========================================
// ASIGNATURAS
//==========================================

// Obtener asignaturas
app.get("/api/asignaturas", (req, res) => {

    db.all(

        `
        SELECT
            idAsignatura,
            NombresMaterias,
            HorasTotales
        FROM Asignaturas
        ORDER BY NombresMaterias
        `,

        [],

        (err, rows) => {

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json(rows);

        }

    );

});

// Agregar asignatura
app.post("/api/asignaturas",(req,res)=>{

    const{

        NombresMaterias,
        HorasTotales

    }=req.body;

    db.run(

        `
        INSERT INTO Asignaturas
        (
            NombresMaterias,
            HorasTotales
        )
        VALUES (?,?)
        `,

        [

            NombresMaterias,
            HorasTotales

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                idAsignatura:this.lastID

            });

        }

    );

});

// Actualizar asignatura
app.put("/api/asignaturas/:id",(req,res)=>{

    const{id}=req.params;

    const{

        NombresMaterias,
        HorasTotales

    }=req.body;

    db.run(

        `
        UPDATE Asignaturas
        SET

            NombresMaterias=?,
            HorasTotales=?

        WHERE idAsignatura=?
        `,

        [

            NombresMaterias,
            HorasTotales,
            id

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Asignatura actualizada."

            });

        }

    );

});

// Eliminar asignatura
app.delete("/api/asignaturas/:id",(req,res)=>{

    const{id}=req.params;

    db.run(

        "DELETE FROM Asignaturas WHERE idAsignatura=?",

        [id],

        function(err){

            if(err){

                if(err.message.includes("FOREIGN")){

                    return res.status(400).json({

                        error:"No es posible eliminar esta asignatura porque tiene registros relacionados."

                    });

                }

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Asignatura eliminada."

            });

        }

    );

});


//==========================================
// INTENDENCIA
//==========================================

// Obtener empleados
app.get("/api/intendencia", (req, res) => {

    db.all(

        `
        SELECT
            idEmpleado,
            Nombre,
            Telefono,
            Area,
            Turno
        FROM Intendencia
        ORDER BY Nombre
        `,

        [],

        (err, rows) => {

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json(rows);

        }

    );

});

// Agregar empleado
app.post("/api/intendencia",(req,res)=>{

    const{

        Nombre,
        Telefono,
        Area,
        Turno

    }=req.body;

    db.run(

        `
        INSERT INTO Intendencia
        (
            Nombre,
            Telefono,
            Area,
            Turno
        )
        VALUES (?,?,?,?)
        `,

        [

            Nombre,
            Telefono,
            Area,
            Turno

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                idEmpleado:this.lastID

            });

        }

    );

});

// Actualizar empleado
app.put("/api/intendencia/:id",(req,res)=>{

    const{id}=req.params;

    const{

        Nombre,
        Telefono,
        Area,
        Turno

    }=req.body;

    db.run(

        `
        UPDATE Intendencia
        SET

            Nombre=?,
            Telefono=?,
            Area=?,
            Turno=?

        WHERE idEmpleado=?
        `,

        [

            Nombre,
            Telefono,
            Area,
            Turno,
            id

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Empleado actualizado."

            });

        }

    );

});

// Eliminar empleado
app.delete("/api/intendencia/:id",(req,res)=>{

    const{id}=req.params;

    db.run(

        "DELETE FROM Intendencia WHERE idEmpleado=?",

        [id],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Empleado eliminado."

            });

        }

    );

});


//==========================================
// DATOS ESCUELA
//==========================================

// Obtener datos de escuelas
app.get("/api/datosescuela", (req, res) => {

    const sql = `
        SELECT
            D.CCT,
            D.Nombre,
            D.Telefono,
            D.Email,
            D.Calle,
            D.NumE,
            D.NumI,
            D.CP,
            D.idEstado,
            D.idMunicipio,
            D.idLocalidad,
            E.Nombre AS Estado,
            M.Nombre AS Municipio,
            L.Nombre AS Localidad
        FROM DatosEscuela D
        LEFT JOIN Estados E
            ON D.idEstado = E.idEstado
        LEFT JOIN Municipios M
            ON D.idMunicipio = M.idMunicipio
        LEFT JOIN Localidades L
            ON D.idLocalidad = L.idLocalidad
        ORDER BY D.Nombre
    `;

    db.all(sql, [], (err, rows) => {

        if(err){

            return res.status(500).json({

                error:err.message

            });

        }

        res.json(rows);

    });

});

// Obtener estados
app.get("/api/datosescuela/estados",(req,res)=>{

    db.all(

        "SELECT idEstado, Nombre FROM Estados ORDER BY Nombre",

        [],

        (err,rows)=>{

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json(rows);

        }

    );

});

// Obtener municipios
app.get("/api/datosescuela/municipios",(req,res)=>{

    db.all(

        "SELECT idMunicipio, Nombre FROM Municipios ORDER BY Nombre",

        [],

        (err,rows)=>{

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json(rows);

        }

    );

});

// Obtener localidades
app.get("/api/datosescuela/localidades",(req,res)=>{

    db.all(

        "SELECT idLocalidad, Nombre FROM Localidades ORDER BY Nombre",

        [],

        (err,rows)=>{

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json(rows);

        }

    );

});

// Agregar escuela
app.post("/api/datosescuela",(req,res)=>{

    const{

        CCT,
        Nombre,
        Telefono,
        Email,
        Calle,
        NumE,
        NumI,
        idLocalidad,
        idMunicipio,
        idEstado,
        CP

    }=req.body;

    db.run(

        `
        INSERT INTO DatosEscuela
        (
            CCT,
            Nombre,
            Telefono,
            Email,
            Calle,
            NumE,
            NumI,
            idLocalidad,
            idMunicipio,
            idEstado,
            CP
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
        `,

        [

            CCT,
            Nombre,
            Telefono,
            Email,
            Calle,
            NumE,
            NumI,
            idLocalidad,
            idMunicipio,
            idEstado,
            CP

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                CCT

            });

        }

    );

});

// Actualizar escuela
app.put("/api/datosescuela/:cct",(req,res)=>{

    const{cct}=req.params;

    const{

        Nombre,
        Telefono,
        Email,
        Calle,
        NumE,
        NumI,
        idLocalidad,
        idMunicipio,
        idEstado,
        CP

    }=req.body;

    db.run(

        `
        UPDATE DatosEscuela
        SET

            Nombre=?,
            Telefono=?,
            Email=?,
            Calle=?,
            NumE=?,
            NumI=?,
            idLocalidad=?,
            idMunicipio=?,
            idEstado=?,
            CP=?

        WHERE CCT=?
        `,

        [

            Nombre,
            Telefono,
            Email,
            Calle,
            NumE,
            NumI,
            idLocalidad,
            idMunicipio,
            idEstado,
            CP,
            cct

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Datos de la escuela actualizados."

            });

        }

    );

});

// Eliminar escuela
app.delete("/api/datosescuela/:cct",(req,res)=>{

    const{cct}=req.params;

    db.run(

        "DELETE FROM DatosEscuela WHERE CCT=?",

        [cct],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Escuela eliminada."

            });

        }

    );

});


//==========================================
// ROLES
//==========================================

// Obtener roles
app.get("/api/roles", (req, res) => {

    db.all(

        `
        SELECT
            idRol,
            Nombre
        FROM Roles
        ORDER BY Nombre
        `,

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json(rows);

        }

    );

});

// Agregar rol
app.post("/api/roles", (req, res) => {

    const { Nombre } = req.body;

    db.run(

        "INSERT INTO Roles (Nombre) VALUES (?)",

        [Nombre],

        function (err) {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json({

                idRol: this.lastID,

                Nombre

            });

        }

    );

});

// Actualizar rol
app.put("/api/roles/:id", (req, res) => {

    const { id } = req.params;

    const { Nombre } = req.body;

    db.run(

        "UPDATE Roles SET Nombre=? WHERE idRol=?",

        [

            Nombre,

            id

        ],

        function (err) {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json({

                message: "Rol actualizado."

            });

        }

    );

});

// Eliminar rol
app.delete("/api/roles/:id", (req, res) => {

    const { id } = req.params;

    db.run(

        "DELETE FROM Roles WHERE idRol=?",

        [

            id

        ],

        function (err) {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }

            res.json({

                message: "Rol eliminado."

            });

        }

    );

});


//==========================================
// USUARIOS
//==========================================

// Obtener usuarios
app.get("/api/usuarios", (req, res) => {

    const sql = `
        SELECT
            U.idUsuario,
            U.Nombre,
            U.Usuario,
            U.Password,
            U.idRol,
            R.Nombre AS Rol
        FROM Usuarios U
        INNER JOIN Roles R
            ON U.idRol = R.idRol
        ORDER BY U.Nombre
    `;

    db.all(sql, [], (err, rows) => {

        if(err){

            return res.status(500).json({

                error:err.message

            });

        }

        res.json(rows);

    });

});

// Obtener roles
app.get("/api/usuarios/roles",(req,res)=>{

    db.all(

        `
        SELECT
            idRol,
            Nombre
        FROM Roles
        ORDER BY Nombre
        `,

        [],

        (err,rows)=>{

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json(rows);

        }

    );

});

// Agregar usuario
app.post("/api/usuarios",(req,res)=>{

    const{

        Nombre,
        Usuario,
        Password,
        idRol

    }=req.body;

    db.run(

        `
        INSERT INTO Usuarios
        (
            Nombre,
            Usuario,
            Password,
            idRol
        )
        VALUES (?,?,?,?)
        `,

        [

            Nombre,
            Usuario,
            Password,
            idRol

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                idUsuario:this.lastID

            });

        }

    );

});

// Actualizar usuario
app.put("/api/usuarios/:id",(req,res)=>{

    const{id}=req.params;

    const{

        Nombre,
        Usuario,
        Password,
        idRol

    }=req.body;

    db.run(

        `
        UPDATE Usuarios
        SET

            Nombre=?,
            Usuario=?,
            Password=?,
            idRol=?

        WHERE idUsuario=?
        `,

        [

            Nombre,
            Usuario,
            Password,
            idRol,
            id

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                message:"Usuario actualizado."

            });

        }

    );

});

// Eliminar usuario
app.delete("/api/usuarios/:id",(req,res)=>{

    console.log("======== DELETE ========");
    console.log("ID:", req.params.id);

    db.run(

        "DELETE FROM Usuarios WHERE idUsuario=?",

        [req.params.id],

        function(err){

            if(err){

                console.log("ERROR:", err);

                return res.status(500).json({
                    error:err.message
                });

            }

            console.log("CAMBIOS:", this.changes);

            res.json({
                message:"Usuario eliminado."
            });

        }

    );

});



// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo correctamente en http://localhost:${PORT}`);
});
