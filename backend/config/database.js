// ======================================================
// CONFIGURACIÓN DE LA BASE DE DATOS
// ======================================================

// Importa la librería SQLite
const sqlite3 = require("sqlite3").verbose();

// Crea la conexión con la base de datos "escuela.db"
const db = new sqlite3.Database("./escuela.db", (err) => {

    if (err) {

        console.error("❌ Error al conectar con la base de datos:", err.message);

    } else {

        console.log("✅ Base de datos conectada correctamente.");

    }

});

// Exporta la conexión para que otros archivos puedan utilizarla
module.exports = db;