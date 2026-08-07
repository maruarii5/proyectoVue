-- SQLite
UPDATE Usuarios
SET idRol = 1
WHERE Usuario = 'admin@gmail.com';

SELECT idUsuario, Nombre, Usuario, idRol
FROM Usuarios;



SELECT sql
FROM sqlite_master
WHERE type='table'
AND name='Alumnos';


PRAGMA table_info(Carreras);
PRAGMA table_info(Alumnos);

DROP TABLE Alumnos;

PRAGMA table_info(Alumnos);

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Alumnos (
    Matricula TEXT PRIMARY KEY,
    idCarrera INTEGER NOT NULL,
    idDatosP INTEGER NOT NULL,
    Status TEXT DEFAULT 'A',
    FOREIGN KEY (idCarrera) REFERENCES Carreras(idCarrera) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (idDatosP) REFERENCES DatosPersonales(idDatosP) ON DELETE RESTRICT ON UPDATE CASCADE
);


SELECT name 
FROM sqlite_master 
WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
ORDER BY name;

SELECT * FROM Alumnos;
