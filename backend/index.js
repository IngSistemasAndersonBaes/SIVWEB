const express = require('express');
const cors = require('cors');

require('dotenv').config();

const usuariosRoutes = require('./usuariosRoutes');
const areasRoutes = require('./areasRoutes');
const equiposRoutes = require('./equiposRoutes');
const productosRoutes = require('./productosRoutes');
const ventasRoutes = require('./ventasRoutes');
const errorHandler = require('./middlewares/errorHandler');

//Crear instancia de express
const app = express();

//Permitir solicitudes de otros dominios
app.use(cors());

//Middleware para analizar json
app.use(express.json());

//Importamos el uso de las rutas
app.use('/', usuariosRoutes);
app.use('/', areasRoutes);
app.use('/', equiposRoutes);
app.use('/', productosRoutes);
app.use('/', ventasRoutes);

//middleware para manejo de errores
app.use(errorHandler);

//Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor ejecutandose en http://localhost:${port}`);
});