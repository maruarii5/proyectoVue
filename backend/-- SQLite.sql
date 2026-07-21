-- SQLite
UPDATE Usuarios
SET idRol = 1
WHERE Usuario = 'admin@gmail.com';

SELECT idUsuario, Nombre, Usuario, idRol
FROM Usuarios;