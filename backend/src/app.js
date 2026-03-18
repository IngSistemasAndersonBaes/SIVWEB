const express = require('express');
const cors = require('cors');

const usuariosRoutes = require('./routes/usuariosRoutes');
const areasRoutes = require('./routes/areasRoutes');
const equiposRoutes = require('./routes/equiposRoutes');
const productosRoutes = require('./routes/productosRoutes');
const ventasRoutes = require('./routes/ventasRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', usuariosRoutes);
app.use('/', areasRoutes);
app.use('/', equiposRoutes);
app.use('/', productosRoutes);
app.use('/', ventasRoutes);

app.use(errorHandler);

module.exports = app;
