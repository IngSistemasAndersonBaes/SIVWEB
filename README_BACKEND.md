# Documentación Backend

## Resumen
API REST construida con Express y MySQL. Incluye autenticación JWT, manejo de errores centralizado y rutas para usuarios, ventas, equipos, áreas y productos.

## Estructura de carpetas
- `backend/src/index.js`: Punto de entrada del servidor.
- `backend/src/app.js`: Configuración de Express, middlewares y rutas.
- `backend/src/routes/`: Rutas del API.
- `backend/src/middlewares/`: Middlewares compartidos (auth, errorHandler).
- `backend/src/db/`: Conexión a la base de datos.
- `backend/src/utils/`: Utilidades (fechas).

## Requisitos
- Node.js 18+
- MySQL

## Variables de entorno
Configurar en `backend/.env`:
- `PORT`: Puerto del servidor (default 3000)
- `DB_HOST`: Host MySQL
- `DB_USER`: Usuario MySQL
- `DB_PASSWORD`: Password MySQL
- `DB_DATABASE`: Base de datos MySQL
- `JWT_SECRET`: Secreto para firmar tokens JWT

## Scripts
Desde `backend/`:
- `npm run dev`: Inicia el servidor con nodemon

## Autenticación
- Todas las rutas (excepto `/login`) requieren token JWT.
- Enviar header: `Authorization: Bearer <token>`.

## Endpoints

### Auth
- `POST /login`
  - Body:
    - `usuario` (string)
    - `contrasena` (string)
  - Respuesta:
    - `token` (JWT)
    - `usuario` (objeto con `usuario`, `nombre`, `area`, `estado`)

### Usuarios (protegidas)
- `GET /usuarios`
- `POST /usuarios`
  - Body: `usuario`, `contrasena`, `nombre`, `area`, `correo`, `estado?`
- `PUT /usuarios/:usuario`
  - Body: `nombre`, `contrasena?`, `area`, `correo`, `estado`
- `DELETE /usuarios/:usuario`

### Áreas (protegidas)
- `GET /areas`

### Productos (protegidas)
- `GET /productos`
- `GET /producto?codigo=...`
- `POST /productos`
  - Body: `codigo`, `num_producto`, `desc_producto`, `pre_publico`, `pre_proveedor`, `existencias`
- `PUT /productos/:codigo`
  - Body: `num_producto`, `desc_producto`, `pre_publico`, `pre_proveedor`, `existencias`
- `DELETE /productos/:producto`

### Ventas (protegidas)
- `GET /ventas?inicio=YYYY-MM-DD&fin=YYYY-MM-DD`
- `POST /ventas`
  - Body recomendado:
    - `productos` (string)
    - `total_venta` (number)
    - `vendedor` (string)
  - Compatibilidad legacy:
    - `venta`: string con formato `productos_total_vendedor`

### Equipos (protegidas)
- `GET /estados_equipo`
- `GET /equipos`
- `POST /equipos/asignacion`
  - Body: `num_serie`, `usuario?`
- `POST /equipos/reporte/add`
  - Body: `num_serie`, `falla`
- `GET /equipos/mantenimientos`
- `POST /equipos/mantenimientos/update`
  - Body: `num_serie`, `id_historial`, `tecnico`, `solucion`
- `POST /equipos/mantenimientos/find`
  - Body: `filter`

## Manejo de errores
- Respuestas JSON con estructura:
  - `success: false`
  - `message: <detalle>`

## Notas
- Se recomienda ejecutar migraciones y cargar el esquema desde `db_inv_ti.sql` si aplica a tu entorno.
- Verifica que `JWT_SECRET` esté configurado antes de usar `/login`.
