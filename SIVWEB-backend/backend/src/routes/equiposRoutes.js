const express = require('express');
const Joi = require('joi');
const router = express.Router();

const db = require('../db/conexion');
const auth = require('../middlewares/auth');
const { authorizeAreas } = require('../middlewares/authorizeAreas');
const { formatDate, parseDateOnly } = require('../utils/date');
const { validateBody } = require('../middlewares/validate');

const equipmentSchema = Joi.object({
    num_serie: Joi.string().max(50).required(),
    equipo: Joi.string().max(100).required(),
    area: Joi.string().max(100).required(),
    descripcion: Joi.string().allow('').optional(),
    estado: Joi.string().max(50).required(),
    responsable: Joi.string().max(20).allow('', null).optional(),
    fecha_adquisicion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    fecha_asignacion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    fecha_baja: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow('', null).optional()
});

const equipmentUpdateSchema = Joi.object({
    equipo: Joi.string().max(100).required(),
    area: Joi.string().max(100).required(),
    descripcion: Joi.string().allow('').optional(),
    estado: Joi.string().max(50).required(),
    responsable: Joi.string().max(20).allow('', null).optional(),
    fecha_adquisicion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    fecha_asignacion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    fecha_baja: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow('', null).optional()
});

const normalizeNullableDate = (value, fallback) => {
    if (!value || String(value).trim() === '') {
        return fallback;
    }

    const parsed = parseDateOnly(value);
    return parsed ? formatDate(parsed) : null;
};

router.get('/estados_equipo', auth, authorizeAreas('Tecnologia'), (req, res, next) => {
    db.query('SELECT * FROM estados_equipo', (err, results) => {
        if (err) {
            return next(err);
        }
        return res.json(results);
    });
});

router.get('/equipos', auth, authorizeAreas('Tecnologia'), (req, res, next) => {
    db.query('SELECT * FROM equipos', (err, results) => {
        if (err) {
            return next(err);
        }
        return res.json(results);
    });
});

router.post('/equipos', auth, authorizeAreas('Tecnologia'), validateBody(equipmentSchema), (req, res, next) => {
    const {
        num_serie,
        equipo,
        area,
        descripcion,
        estado,
        responsable,
        fecha_adquisicion,
        fecha_asignacion,
        fecha_baja,
    } = req.body;

    const fechaAdquisicion = normalizeNullableDate(fecha_adquisicion);
    const fechaAsignacion = normalizeNullableDate(fecha_asignacion);
    const fechaBaja = normalizeNullableDate(fecha_baja, '1900-01-01');

    if (!fechaAdquisicion || !fechaAsignacion || !fechaBaja) {
        return res.status(400).send('Las fechas del equipo no son validas');
    }

    const query = `
        INSERT INTO equipos (
            num_serie, equipo, area, descripcion, estado, responsable,
            fecha_adquisicion, fecha_asignacion, fecha_baja
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            num_serie,
            equipo,
            area,
            descripcion || null,
            estado,
            responsable && String(responsable).trim() !== '' ? responsable : null,
            fechaAdquisicion,
            fechaAsignacion,
            fechaBaja,
        ],
        (err) => {
            if (err) {
                return next(err);
            }
            return res.status(201).json({
                num_serie,
                equipo,
                area,
                descripcion: descripcion || '',
                estado,
                responsable: responsable || null,
                fecha_adquisicion: fechaAdquisicion,
                fecha_asignacion: fechaAsignacion,
                fecha_baja: fechaBaja,
            });
        }
    );
});

router.put('/equipos/:numSerie', auth, authorizeAreas('Tecnologia'), validateBody(equipmentUpdateSchema), (req, res, next) => {
    const { numSerie } = req.params;
    const {
        equipo,
        area,
        descripcion,
        estado,
        responsable,
        fecha_adquisicion,
        fecha_asignacion,
        fecha_baja,
    } = req.body;

    const fechaAdquisicion = normalizeNullableDate(fecha_adquisicion);
    const fechaAsignacion = normalizeNullableDate(fecha_asignacion);
    const fechaBaja = normalizeNullableDate(fecha_baja, '1900-01-01');

    if (!fechaAdquisicion || !fechaAsignacion || !fechaBaja) {
        return res.status(400).send('Las fechas del equipo no son validas');
    }

    const query = `
        UPDATE equipos
        SET equipo = ?, area = ?, descripcion = ?, estado = ?, responsable = ?,
            fecha_adquisicion = ?, fecha_asignacion = ?, fecha_baja = ?
        WHERE num_serie = ?
    `;

    db.query(
        query,
        [
            equipo,
            area,
            descripcion || null,
            estado,
            responsable && String(responsable).trim() !== '' ? responsable : null,
            fechaAdquisicion,
            fechaAsignacion,
            fechaBaja,
            numSerie,
        ],
        (err, result) => {
            if (err) {
                return next(err);
            }
            if (!result.affectedRows) {
                return res.status(404).send('Equipo no encontrado');
            }
            return res.send('Equipo actualizado correctamente');
        }
    );
});

router.delete('/equipos/:numSerie', auth, authorizeAreas('Tecnologia'), (req, res, next) => {
    const { numSerie } = req.params;

    db.query('DELETE FROM equipos WHERE num_serie = ?', [numSerie], (err, result) => {
        if (err) {
            return next(err);
        }
        if (!result.affectedRows) {
            return res.status(404).send('Equipo no encontrado');
        }
        return res.send('Equipo eliminado correctamente');
    });
});

router.post('/equipos/asignacion', auth, authorizeAreas('Tecnologia'), (req, res, next) => {
    const { num_serie, usuario } = req.body;

    if (!num_serie) {
        return res.status(400).send('Numero de serie requerido');
    }

    const responsable = usuario && String(usuario).trim() !== '' ? usuario : null;

    const query = 'UPDATE equipos SET responsable = ? WHERE num_serie = ?';
    db.query(query, [responsable, num_serie], (err) => {
        if (err) {
            return next(err);
        }
        return res.status(200).send('Se asigno exitosamente el usuario al equipo correspondiente');
    });
});

router.post('/equipos/reporte/add', auth, authorizeAreas('Tecnologia'), (req, res, next) => {
    const { num_serie, falla } = req.body;

    if (!num_serie || !falla) {
        return res.status(400).send('Numero de serie y la falla son requeridos');
    }

    const fecha_reporte = formatDate(new Date());

    db.beginTransaction((err) => {
        if (err) {
            return next(err);
        }

        const updateEstadoQuery = 'UPDATE equipos SET estado = "mantenimiento" WHERE num_serie = ?';
        db.query(updateEstadoQuery, [num_serie], (errUpdate) => {
            if (errUpdate) {
                return db.rollback(() => next(errUpdate));
            }

            const id_historial = Date.now();
            const insertHistorialQuery = 'INSERT INTO historial_mantenimientos (id_historial, num_serie, fecha_reporte, falla) VALUES (?, ?, ?, ?)';

            db.query(insertHistorialQuery, [id_historial, num_serie, fecha_reporte, falla], (errInsert) => {
                if (errInsert) {
                    return db.rollback(() => next(errInsert));
                }

                db.commit((errCommit) => {
                    if (errCommit) {
                        return db.rollback(() => next(errCommit));
                    }

                    return res.status(200).send('Estado actualizado a mantenimiento y reporte registrado exitosamente');
                });
            });
        });
    });
});

router.get('/equipos/mantenimientos', auth, authorizeAreas('Tecnologia'), (req, res, next) => {
    const query = 'SELECT * FROM historial_mantenimientos WHERE fecha_solucion IS NULL ORDER BY fecha_reporte ASC';

    db.query(query, (err, results) => {
        if (err) {
            return next(err);
        }

        return res.json(results);
    });
});

router.post('/equipos/mantenimientos/update', auth, authorizeAreas('Tecnologia'), (req, res, next) => {
    const { num_serie, id_historial, tecnico, solucion } = req.body;

    if (!num_serie || !id_historial || !tecnico || !solucion) {
        return res.status(400).send('El id, numero de serie, tecnico y solucion son requeridos');
    }

    const fecha_solucion = formatDate(new Date());

    db.beginTransaction((err) => {
        if (err) {
            return next(err);
        }

        const updateEstadoQuery = 'UPDATE equipos SET estado = "activo" WHERE num_serie = ?';
        db.query(updateEstadoQuery, [num_serie], (errUpdate) => {
            if (errUpdate) {
                return db.rollback(() => next(errUpdate));
            }

            const updateHistorialQuery = 'UPDATE historial_mantenimientos SET fecha_solucion = ?, usuario_tecnico = ?, solucion = ? WHERE id_historial = ?';
            db.query(updateHistorialQuery, [fecha_solucion, tecnico, solucion, id_historial], (errHistorial) => {
                if (errHistorial) {
                    return db.rollback(() => next(errHistorial));
                }

                db.commit((errCommit) => {
                    if (errCommit) {
                        return db.rollback(() => next(errCommit));
                    }

                    return res.status(200).send('Estado del equipo actualizado a activo y mantenimiento actualizado');
                });
            });
        });
    });
});

router.post('/equipos/mantenimientos/find', auth, authorizeAreas('Tecnologia'), (req, res, next) => {
    const { filter } = req.body;

    if (!filter) {
        return res.status(400).json({ error: 'Se debe proporcionar al menos uno de los parametros' });
    }

    const query = `SELECT * FROM historial_mantenimientos 
    WHERE (id_historial = ? OR num_serie = ? OR usuario_tecnico = ?)
    AND solucion IS NOT NULL`;

    db.query(query, [filter, filter, filter], (err, results) => {
        if (err) {
            return next(err);
        }

        return res.json(results);
    });
});

module.exports = router;
