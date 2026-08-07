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