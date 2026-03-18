const express = require('express');
const router = express.Router();
const db = require('./conexion');
const bcrypt = require('bcrypt');

const salCaracter = 10;
//Ruta para el login
router.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;
    
    try{
        if (!usuario || !contrasena) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        //Buscar el usuario en base de datos (se obtiene la contraseña hasheada)
        db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
            }
            if (results.length === 0) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const usuarioEncontrado = results[0];
            const hash = usuarioEncontrado.contrasena;

            bcrypt.compare(contrasena, hash, (err, match) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al verificar la contraseña' });
                }
                if (!match) {
                    return res.status(401).json({ error: 'Credenciales inválidas' });
                }

                res.status(200).send({
                    mensaje: '',
                    usuario: {
                        usuario: usuarioEncontrado.usuario,
                        nombre: usuarioEncontrado.nombre,
                        area: usuarioEncontrado.area,
                        estado: usuarioEncontrado.estado
                    }
                });
            });
        });
    }
    catch (err){
        next(err);
    }
});

//Ruta para obtener todos los usuarios 
router.get('/usuarios', (req, res) => {
    db.query('SELECT usuario, nombre, area, correo, estado FROM usuarios', (err, results) => {
        if (err) {
            return res.status(500).send('Error en la consulta');
        }
        res.json(results);  
    });
});

//Ruta para agregar un nuevo usuario
router.post('/usuarios', (req, res) => {
    const { usuario, contrasena, nombre, area, correo, estado } = req.body;

    if (!usuario || !contrasena || !nombre || !area || !correo) {
        return res.status(400).send('Faltan campos requeridos');
    }

    bcrypt.hash(contrasena, salCaracter, (err, hash) => {
        if (err) {
            console.error('Error al hashear la contraseña:', err);
            return res.status(500).send('Error al procesar la contraseña');
        }

        const query = `INSERT INTO usuarios (usuario, contrasena, nombre, area, correo, estado) VALUES (?, ?, ?, ?, ?, "activo")`;
        db.query(query, [usuario, hash, nombre, area, correo, estado], (err, results) => {
            if (err) {
                console.error('Error al agregar el usuario:', err);
                return res.status(500).send('Error al agregar el usuario');
            }
            res.status(201).send({
                usuario, nombre, contrasena, area, correo, estado
            });
        });
    });
});

//Ruta para editar un usuario

router.put('/usuarios/:usuario', (req, res) => {
    const { usuario } = req.params;
    const { nombre, contrasena, area, correo, estado } = req.body;

    const updateUser = (passwordHash) => {
        const query = `UPDATE usuarios SET nombre = ?, contrasena = ?, area = ?, correo = ?, estado = ? WHERE usuario = ?`;
        db.query(query, [nombre, passwordHash, area, correo, estado, usuario], (err, results) => {
            if (err) {
                return res.status(500).send('Error al actualizar el usuario');
            }
            res.send('Usuario actualizado');
        });
    };

    if (contrasena) {
        bcrypt.hash(contrasena, salCaracter, (err, hash) => {
            if (err) {
                console.error('Error al hashear la contraseña:', err);
                return res.status(500).send('Error al procesar la contraseña');
            }
            updateUser(hash);
        });
    } else {
        // Si no se proporciona nueva contraseña, se mantiene la existente
        db.query('SELECT contrasena FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
            if (err || results.length === 0) {
                return res.status(500).send('Error al obtener el usuario');
            }
            updateUser(results[0].contrasena);
        });
    }
});

//Ruta para elminar un usuario
router.delete('/usuarios/:usuario', (req, res) => {
    const { usuario } = req.params;

    const query = `DELETE FROM usuarios WHERE usuario = ?`;
    db.query(query, [usuario], (err, results) => {
        if (err) {
            return res.status(500).send('Error al eliminar el usuario');
        }
        res.send('Usuario eliminado')
    });
});

module.exports = router;