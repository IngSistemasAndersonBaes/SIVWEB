const express = require('express');
const Joi = require('joi');
const router = express.Router();

const db = require('../db/conexion');
const { formatDate, parseDateOnly } = require('../utils/date');
const auth = require('../middlewares/auth');
const { authorizeAreas } = require('../middlewares/authorizeAreas');
const { validateBody, validateQuery } = require('../middlewares/validate');

const ventasQuerySchema = Joi.object({
    inicio: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    fin: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
});

const ventasBodySchema = Joi.object({
    venta: Joi.string().optional(),
    productos: Joi.string().optional(),
    total_venta: Joi.number().positive().optional(),
    vendedor: Joi.string().max(20).optional()
}).custom((value, helpers) => {
    if (value.venta) {
        return value;
    }
    if (!value.productos || value.total_venta === undefined || !value.vendedor) {
        return helpers.error('any.custom');
    }
    return value;
}, 'validacion de ventas');

router.get('/ventas', auth, authorizeAreas('Finanzas'), validateQuery(ventasQuerySchema), (req, res, next) => {
    const { inicio, fin } = req.query;

    const fechaInicio = parseDateOnly(inicio);
    const fechaFin = parseDateOnly(fin);

    if (!fechaInicio || !fechaFin) {
        return res.status(400).send('Fechas no validas');
    }

    if (fechaInicio > fechaFin) {
        return res.status(400).send('La fecha de inicio no puede ser mayor a la fecha final');
    }

    const fechaInicioStr = formatDate(fechaInicio);
    const fechaFinStr = formatDate(fechaFin);

    const query = 'SELECT * FROM ventas WHERE fecha_venta BETWEEN ? AND ?';
    db.query(query, [fechaInicioStr, fechaFinStr], (err, results) => {
        if (err) {
            return next(err);
        }
        return res.status(200).json(results);
    });
});

router.post('/ventas', auth, authorizeAreas('Finanzas'), validateBody(ventasBodySchema), (req, res, next) => {
    const { venta, productos, total_venta, vendedor } = req.body;

    let productosValue = productos;
    let totalVentaValue = total_venta;
    let vendedorValue = vendedor;

    if (venta) {
        const partes = String(venta).split('_');
        if (partes.length < 3) {
            return res.status(400).send('Formato de venta no valido');
        }

        vendedorValue = partes.pop();
        totalVentaValue = parseFloat(partes.pop());
        productosValue = partes.join('_');
    }

    if (!productosValue || !vendedorValue) {
        return res.status(400).send('Se requiere informacion completa de la venta');
    }

    if (Number.isNaN(Number(totalVentaValue))) {
        return res.status(400).send('Total de venta no valido');
    }

    const id_venta = Date.now().toString();
    const fecha_venta = formatDate(new Date());

    const query = 'INSERT INTO ventas (id_venta, productos, total_venta, fecha_venta, vendedor) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [id_venta, productosValue, totalVentaValue, fecha_venta, vendedorValue], (err) => {
        if (err) {
            return next(err);
        }
        return res.status(201).json({
            message: 'Venta agregada exitosamente',
            id_venta
        });
    });
});

module.exports = router;
