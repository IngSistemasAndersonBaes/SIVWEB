const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db/conexion');
const auth = require('../middlewares/auth');

const router = express.Router();
const salCaracter = 10;

// Ruta para el login
router.post('/login', (req, res, next) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'JWT_SECRET no configurado' });
    }

    db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
        if (err) {
            return next(err);
        }
        if (!results || results.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuarioEncontrado = results[0];
        const hash = usuarioEncontrado.contrasena;

        bcrypt.compare(contrasena, hash, (errCompare, match) => {
            if (errCompare) {
                return next(errCompare);
            }
            if (!match) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const payload = {
                usuario: usuarioEncontrado.usuario,
                nombre: usuarioEncontrado.nombre,
                area: usuarioEncontrado.area,
                estado: usuarioEncontrado.estado,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

            return res.status(200).json({
                mensaje: 'Login exitoso',
                token,
                usuario: payload,
            });
        });
    });
});

// Ruta para obtener todos los usuarios
router.get('/usuarios', auth, (req, res, next) => {
    db.query('SELECT usuario, nombre, area, correo, estado FROM usuarios', (err, results) => {
        if (err) {
            return next(err);
        }
        return res.json(results);
    });
});

// Ruta para agregar un nuevo usuario
router.post('/usuarios', auth, (req, res, next) => {
    const { usuario, contrasena, nombre, area, correo, estado } = req.body;

    if (!usuario || !contrasena || !nombre || !area || !correo) {
        return res.status(400).send('Faltan campos requeridos');
    }

    const estadoFinal = estado && String(estado).trim() !== '' ? estado : 'activo';

    bcrypt.hash(contrasena, salCaracter, (err, hash) => {
        if (err) {
            return next(err);
        }

        const query = `INSERT INTO usuarios (usuario, contrasena, nombre, area, correo, estado) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(query, [usuario, hash, nombre, area, correo, estadoFinal], (errInsert) => {
            if (errInsert) {
                return next(errInsert);
            }
            return res.status(201).json({
                usuario,
                nombre,
                area,
                correo,
                estado: estadoFinal,
            });
        });
    });
});

// Ruta para editar un usuario
router.put('/usuarios/:usuario', auth, (req, res, next) => {
    const { usuario } = req.params;
    const { nombre, contrasena, area, correo, estado } = req.body;

    const updateUser = (passwordHash) => {
        const query = `UPDATE usuarios SET nombre = ?, contrasena = ?, area = ?, correo = ?, estado = ? WHERE usuario = ?`;
        db.query(query, [nombre, passwordHash, area, correo, estado, usuario], (err) => {
            if (err) {
                return next(err);
            }
            return res.send('Usuario actualizado');
        });
    };

    if (contrasena) {
        bcrypt.hash(contrasena, salCaracter, (err, hash) => {
            if (err) {
                return next(err);
            }
            return updateUser(hash);
        });
    } else {
        // Si no se proporciona nueva contraseña, se mantiene la existente
        db.query('SELECT contrasena FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
            if (err || !results || results.length === 0) {
                return res.status(500).send('Error al obtener el usuario');
            }
            return updateUser(results[0].contrasena);
        });
    }
});

// Ruta para eliminar un usuario
router.delete('/usuarios/:usuario', auth, (req, res, next) => {
    const { usuario } = req.params;

    const query = `DELETE FROM usuarios WHERE usuario = ?`;
    db.query(query, [usuario], (err) => {
        if (err) {
            return next(err);
        }
        return res.send('Usuario eliminado');
    });
});

module.exports = router;
