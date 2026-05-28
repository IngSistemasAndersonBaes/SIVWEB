const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');

const db = require('../db/conexion');
const auth = require('../middlewares/auth');
const { authorizeAreas } = require('../middlewares/authorizeAreas');
const { validateBody } = require('../middlewares/validate');

const router = express.Router();
const salCaracter = 10;
const isProd = process.env.NODE_ENV === 'production';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProd ? 10 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Demasiados intentos, intenta mas tarde.' }
});

const isStrongPassword = (value) => {
    const password = String(value);
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= 8 && hasLower && hasUpper && hasNumber;
};

const looksLikeBcryptHash = (value) => /^\$2[aby]\$/.test(String(value || ''));

const comparePassword = async (plainPassword, storedPassword) => {
    if (!storedPassword) {
        return false;
    }

    if (looksLikeBcryptHash(storedPassword)) {
        return bcrypt.compare(plainPassword, storedPassword);
    }

    return String(plainPassword) === String(storedPassword);
};

const loginSchema = Joi.object({
    usuario: Joi.string().max(20).required(),
    contrasena: Joi.string().required()
});

const createUserSchema = Joi.object({
    usuario: Joi.string().max(20).required(),
    contrasena: Joi.string().min(8).required(),
    nombre: Joi.string().max(200).required(),
    area: Joi.string().max(100).required(),
    correo: Joi.string().email().max(50).required(),
    estado: Joi.string().max(15).optional()
});

const updateUserSchema = Joi.object({
    nombre: Joi.string().max(200).required(),
    contrasena: Joi.string().min(8).optional(),
    area: Joi.string().max(100).required(),
    correo: Joi.string().email().max(50).required(),
    estado: Joi.string().max(15).required()
});

router.post('/login', loginLimiter, validateBody(loginSchema), (req, res, next) => {
    const { usuario, contrasena } = req.body;

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'JWT_SECRET no configurado' });
    }

    db.query('SELECT usuario, contrasena, nombre, area, estado FROM usuarios WHERE usuario = ?', [usuario], async (err, results) => {
        if (err) {
            return next(err);
        }
        if (!results || results.length === 0) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        const usuarioEncontrado = results[0];
        if (String(usuarioEncontrado.estado).toLowerCase() !== 'activo') {
            return res.status(403).json({ error: 'Usuario inactivo' });
        }

        try {
            const match = await comparePassword(contrasena, usuarioEncontrado.contrasena);
            if (!match) {
                return res.status(401).json({ error: 'Credenciales invalidas' });
            }

            const payload = {
                usuario: usuarioEncontrado.usuario,
                nombre: usuarioEncontrado.nombre,
                area: usuarioEncontrado.area,
                estado: usuarioEncontrado.estado,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? 'none' : 'lax',
                maxAge: 4 * 60 * 60 * 1000
            });

            return res.status(200).json({
                mensaje: 'Login exitoso',
                usuario: payload
            });
        } catch (compareError) {
            return next(compareError);
        }
    });
});

router.get('/usuarios', auth, authorizeAreas('Recursos Humanos'), (req, res, next) => {
    const query = 'SELECT usuario, nombre, area, correo, estado FROM usuarios ORDER BY nombre ASC';

    db.query(query, (err, results) => {
        if (err) {
            return next(err);
        }
        return res.json(results);
    });
});

router.post('/usuarios', auth, authorizeAreas('Recursos Humanos'), validateBody(createUserSchema), (req, res, next) => {
    const { usuario, contrasena, nombre, area, correo, estado } = req.body;

    if (!isStrongPassword(contrasena)) {
        return res.status(400).send('La contrasena debe tener al menos 8 caracteres, una mayuscula, una minuscula y un numero');
    }

    const estadoFinal = estado && String(estado).trim() !== '' ? estado : 'activo';

    bcrypt.hash(contrasena, salCaracter, (err, hash) => {
        if (err) {
            return next(err);
        }

        const query = 'INSERT INTO usuarios (usuario, contrasena, nombre, area, correo, estado) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [usuario, hash, nombre, area, correo, estadoFinal], (errInsert) => {
            if (errInsert) {
                return next(errInsert);
            }
            return res.status(201).json({
                usuario,
                nombre,
                area,
                correo,
                estado: estadoFinal
            });
        });
    });
});

router.put('/usuarios/:usuario', auth, authorizeAreas('Recursos Humanos'), validateBody(updateUserSchema), (req, res, next) => {
    const { usuario } = req.params;
    const { nombre, contrasena, area, correo, estado } = req.body;

    if (contrasena && !isStrongPassword(contrasena)) {
        return res.status(400).send('La contrasena debe tener al menos 8 caracteres, una mayuscula, una minuscula y un numero');
    }

    const updateUser = (passwordHash) => {
        const query = 'UPDATE usuarios SET nombre = ?, contrasena = ?, area = ?, correo = ?, estado = ? WHERE usuario = ?';
        db.query(query, [nombre, passwordHash, area, correo, estado, usuario], (err) => {
            if (err) {
                return next(err);
            }
            return res.send('Usuario actualizado');
        });
    };

    db.query('SELECT contrasena FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
        if (err) {
            return next(err);
        }
        if (!results || results.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const usuarioActual = results[0];

        if (contrasena) {
            bcrypt.hash(contrasena, salCaracter, (errHash, hash) => {
                if (errHash) {
                    return next(errHash);
                }
                return updateUser(hash);
            });
            return;
        }

        return updateUser(usuarioActual.contrasena);
    });
});

router.delete('/usuarios/:usuario', auth, authorizeAreas('Recursos Humanos'), (req, res, next) => {
    const { usuario } = req.params;
    const query = 'DELETE FROM usuarios WHERE usuario = ?';

    db.query(query, [usuario], (err, result) => {
        if (err) {
            return next(err);
        }
        if (!result.affectedRows) {
            return res.status(404).send('Usuario no encontrado');
        }
        return res.send('Usuario eliminado');
    });
});

router.post('/logout', auth, (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax'
    });

    return res.json({ mensaje: 'logout ok' });
});

module.exports = router;
