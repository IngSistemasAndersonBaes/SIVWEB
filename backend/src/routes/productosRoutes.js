const express = require('express');
const router = express.Router();

const db = require('../db/conexion');
const auth = require('../middlewares/auth');

// Ruta para obtener los productos de la tabla productos
router.get('/productos', auth, (req, res, next) => {
    const sql = 'SELECT * FROM productos';
    db.query(sql, (err, results) => {
        if (err) {
            return next(err);
        }
        return res.json(results);
    });
});

// Ruta para obtener el producto usando el código del mismo
router.get('/producto', auth, (req, res, next) => {
    const { codigo } = req.query;

    if (!codigo) {
        return res.status(400).send({ error: 'El código es requerido' });
    }

    const query = 'SELECT codigo, num_producto, pre_publico FROM productos WHERE codigo = ?';
    db.query(query, [codigo], (err, results) => {
        if (err) {
            return next(err);
        }
        return res.json(results);
    });
});

// Ruta para agregar un nuevo producto
router.post('/productos', auth, (req, res, next) => {
    const { codigo, num_producto, desc_producto, pre_publico, pre_proveedor, existencias } = req.body;

    if (!codigo || !num_producto || !desc_producto || !pre_publico || !pre_proveedor || !existencias) {
        return res.status(400).send({ error: 'Todos los campos son obligatorios' });
    }

    const query = 'INSERT INTO productos (codigo, num_producto, desc_producto, pre_publico, pre_proveedor, existencias) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [codigo, num_producto, desc_producto, pre_publico, pre_proveedor, existencias], (err) => {
        if (err) {
            return next(err);
        }
        return res.status(201).send({ codigo, num_producto, desc_producto, pre_publico, pre_proveedor, existencias });
    });
});

// Ruta para editar un producto
router.put('/productos/:codigo', auth, (req, res, next) => {
    const { codigo } = req.params;
    const { num_producto, desc_producto, pre_publico, pre_proveedor, existencias } = req.body;

    const query = 'UPDATE productos SET num_producto = ?, desc_producto = ?, pre_publico = ?, pre_proveedor = ?, existencias = ? WHERE codigo = ?';
    db.query(query, [num_producto, desc_producto, pre_publico, pre_proveedor, existencias, codigo], (err) => {
        if (err) {
            return next(err);
        }
        return res.send('Producto actualizado correctamente');
    });
});

// Ruta para eliminar un producto
router.delete('/productos/:producto', auth, (req, res, next) => {
    const { producto } = req.params;
    const query = 'DELETE FROM productos WHERE codigo = ?';

    db.query(query, [producto], (err) => {
        if (err) {
            return next(err);
        }
        return res.send('Producto eliminado correctamente');
    });
});

module.exports = router;
