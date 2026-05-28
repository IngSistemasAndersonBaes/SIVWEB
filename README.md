# SIVWEB - Sistema Integral de Ventas Web

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Descripción General](#descripción-general)
3. [Requisitos del Sistema](#requisitos-del-sistema)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Arquitectura Técnica](#arquitectura-técnica)
7. [Guía de Uso](#guía-de-uso)
8. [Documentación de API](#documentación-de-api)
9. [Seguridad](#seguridad)
10. [Solución de Problemas](#solución-de-problemas)
11. [Contribución](#contribución)

---

## 📖 Introducción

**SIVWEB** es un Sistema Integral de Ventas Web desarrollado con tecnologías modernas que permite gestionar productos, usuarios, equipos, áreas y reportes de ventas. La aplicación implementa una arquitectura robusta con autenticación segura, control de acceso basado en roles (RBAC) y medidas de protección contra vulnerabilidades web comunes.

### Características Principales

- ✅ Autenticación JWT con cookies HttpOnly
- ✅ Protección CSRF en operaciones sensibles
- ✅ Control de acceso basado en roles (Administrador, Trabajador)
- ✅ Gestión completa de usuarios, productos y equipos
- ✅ Auditoría de operaciones críticas
- ✅ Rate limiting en endpoints de autenticación
- ✅ Manejo centralizado de errores
- ✅ CORS configurado para desarrollo y producción

---

## 📱 Descripción General

### Composición del Proyecto

El proyecto está compuesto por dos módulos principales:

| Módulo | Descripción | Lenguajes |
|--------|-------------|-----------|
| **Backend** | API REST con Express y MySQL | Node.js, JavaScript |
| **Frontend** | Interfaz web con React y Vite | TypeScript, React, CSS |

### Estadísticas del Código

- **TypeScript**: 65%
- **JavaScript**: 30.3%
- **CSS**: 4.5%
- **HTML**: 0.2%

---

## 🖥️ Requisitos del Sistema

### Requisitos Mínimos

| Componente | Versión Mínima | Recomendada |
|-----------|-----------------|------------|
| Node.js | 18.x | 20.x LTS o superior |
| npm | 9.x | 10.x o superior |
| MySQL | 5.7 | 8.0 o superior |
| RAM | 2 GB | 4 GB |
| Espacio en Disco | 500 MB | 2 GB |

### Dependencias Globales

```bash
node --version  # Verificar Node.js
npm --version   # Verificar npm
mysql --version # Verificar MySQL
```

---

## 📁 Estructura del Proyecto

```
SIVWEB/
├── SIVWEB-backend/                 # Módulo Backend
│   ├── src/
│   │   ├── index.js                # Punto de entrada del servidor
│   │   ├── app.js                  # Configuración de Express
│   │   ├── routes/                 # Rutas de la API
│   │   │   ├── usuariosRoutes.js
│   │   │   ├── productosRoutes.js
│   │   │   ├── areasRoutes.js
│   │   │   ├── equiposRoutes.js
│   │   │   └── ventasRoutes.js
│   │   ├── middlewares/            # Middlewares compartidos
│   │   │   ├── auth.js
│   │   │   ├── authorizeRoles.js
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   ├── db/                     # Configuración de base de datos
│   │   │   └── conexion.js
│   │   └── utils/                  # Utilidades
│   │       └── date.js
│   ├── .env                        # Variables de entorno
│   ├── package.json
│   └── README.md
│
├── SIVWEB-frontend/                # Módulo Frontend
│   ├── src/
│   │   ├── main.tsx               # Punto de entrada React
│   │   ├── App.tsx                # Componente raíz
│   │   ├── components/            # Componentes reutilizables
│   │   ├── pages/                 # Páginas de la aplicación
│   │   ├── services/              # Servicios (API calls)
│   │   ├── hooks/                 # Hooks personalizados
│   │   ├── context/               # Contexto de React
│   │   ├── styles/                # Estilos globales
│   │   └── utils/                 # Utilidades
│   ├── public/                    # Archivos estáticos
│   ├── .env                       # Variables de entorno
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── db_inv_ti.sql                  # Esquema de base de datos
├── README.md                      # Este archivo
└── .gitignore

```

---

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/IngSistemasAndersonBaes/SIVWEB.git
cd SIVWEB
```

### 2. Configurar Base de Datos

#### Crear la Base de Datos

```bash
# Importar el esquema SQL
mysql -u TU_USUARIO -p < db_inv_ti.sql

# O manualmente
mysql -u TU_USUARIO -p
mysql> CREATE DATABASE inv_ti;
mysql> USE inv_ti;
mysql> source db_inv_ti.sql;
```

#### Verificar Esquema

```sql
-- Verificar tablas creadas
SHOW TABLES;

-- Verificar estructura de tabla usuarios
DESCRIBE usuarios;
```

### 3. Configurar Backend

#### Instalar Dependencias

```bash
cd SIVWEB-backend
npm install
```

#### Configurar Variables de Entorno

Crear archivo `.env` en `SIVWEB-backend/`:

```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_DATABASE=inv_ti

# Configuración de Seguridad
JWT_SECRET=tu_secreto_jwt_muy_seguro_y_largo
JWT_EXPIRATION=24h

# Configuración de CORS
CORS_ORIGIN=http://localhost:5173

# Configuración de Rate Limiting
RATE_LIMIT_WINDOW_MS=15000
RATE_LIMIT_MAX_REQUESTS=5
```

#### Iniciar el Backend

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

**Salida esperada:**
```
Servidor ejecutándose en puerto 3000
Conexión a base de datos exitosa
```

### 4. Configurar Frontend

#### Instalar Dependencias

```bash
cd SIVWEB-frontend
npm install
```

#### Configurar Variables de Entorno

Crear archivo `.env` en `SIVWEB-frontend/`:

```env
# Configuración de API
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=SIVWEB

# Configuración de Aplicación
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```

#### Iniciar el Frontend

```bash
# Modo desarrollo
npm run dev

# Compilación para producción
npm run build

# Previsualizar compilación
npm run preview
```

**Salida esperada:**
```
Local:   http://localhost:5173/
Press q to quit
```

### 5. Verificar Instalación

Acceder a la aplicación:

1. Abrir navegador: `http://localhost:5173`
2. Credenciales por defecto:
   - **Usuario**: `admin`
   - **Contraseña**: `MiPass123`

---

## 🏗️ Arquitectura Técnica

### Backend - Arquitectura de Capas

```
Request
   ↓
┌─ CORS & Seguridad HTTP
├─ Rate Limiter
├─ Body Parser
├─ Cookie Parser
├─ CSRF Validator
   ↓
┌─ Rutas (Routes)
   ├─ Validación (Joi)
   ├─ Autenticación (JWT)
   ├─ Autorización (Roles)
   ├─ Lógica de Negocio
   ├─ Acceso a Datos (MySQL)
   ↓
┌─ Manejo de Errores (Centralizado)
   ↓
Response
```

### Flujo de Autenticación

```
1. Cliente → POST /login (usuario, contraseña)
             ↓
2. Backend  → Validar credenciales en BD
             ↓
3. Backend  → Generar JWT y guardar en HttpOnly Cookie
             ↓
4. Cliente  ← Recibir cookie (automáticamente)
             ↓
5. Próximas solicitudes → JWT validado por middleware auth
             ↓
6. logout   → Incrementar token_version para revocar
```

### Flujo CSRF

```
1. GET /csrf-token
   ↓
2. Backend genera y guarda token en sesión
   ↓
3. Cliente recibe csrfToken
   ↓
4. POST/PUT/DELETE con header x-csrf-token
   ↓
5. Backend valida token CSRF
```

---

## 📖 Guía de Uso

### Autenticación

#### Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","contrasena":"MiPass123"}' \
  -c cookies.txt
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "usuario": {
    "usuario": "admin",
    "nombre": "Administrador",
    "area": "IT",
    "estado": "activo",
    "rol": "administrador"
  }
}
```

#### Logout

```bash
curl -X POST http://localhost:3000/logout \
  -b cookies.txt
```

### Obtener Token CSRF

```bash
curl -X GET http://localhost:3000/csrf-token \
  -b cookies.txt
```

**Respuesta:**
```json
{
  "csrfToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Gestión de Usuarios

#### Listar Usuarios (Solo Administrador)

```bash
curl -X GET http://localhost:3000/usuarios \
  -b cookies.txt
```

#### Crear Usuario

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: <token>" \
  -b cookies.txt \
  -d '{
    "usuario": "trabajador1",
    "contrasena": "Pass123!",
    "nombre": "Juan Pérez",
    "area": "Ventas",
    "correo": "juan@example.com",
    "rol": "trabajador"
  }'
```

#### Actualizar Usuario

```bash
curl -X PUT http://localhost:3000/usuarios/trabajador1 \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: <token>" \
  -b cookies.txt \
  -d '{
    "nombre": "Juan Carlos Pérez",
    "area": "Ventas",
    "correo": "juan.carlos@example.com",
    "estado": "activo",
    "rol": "trabajador"
  }'
```

#### Eliminar Usuario

```bash
curl -X DELETE http://localhost:3000/usuarios/trabajador1 \
  -H "x-csrf-token: <token>" \
  -b cookies.txt
```

### Gestión de Productos

#### Listar Productos

```bash
curl -X GET http://localhost:3000/productos \
  -b cookies.txt
```

#### Buscar Producto por Código

```bash
curl -X GET 'http://localhost:3000/producto?codigo=PROD001' \
  -b cookies.txt
```

#### Crear Producto

```bash
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: <token>" \
  -b cookies.txt \
  -d '{
    "codigo": "PROD001",
    "nom_producto": "Laptop HP",
    "desc_producto": "Laptop HP 15 pulgadas",
    "pre_publico": 1200000,
    "pre_proveedor": 900000,
    "existencias": 10
  }'
```

#### Actualizar Producto

```bash
curl -X PUT http://localhost:3000/productos/PROD001 \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: <token>" \
  -b cookies.txt \
  -d '{
    "nom_producto": "Laptop HP 15",
    "desc_producto": "Laptop HP 15 pulgadas - Procesador i7",
    "pre_publico": 1250000,
    "pre_proveedor": 920000,
    "existencias": 8
  }'
```

#### Eliminar Producto

```bash
curl -X DELETE http://localhost:3000/productos/PROD001 \
  -H "x-csrf-token: <token>" \
  -b cookies.txt
```

### Gestión de Ventas

#### Listar Ventas por Rango de Fechas

```bash
curl -X GET 'http://localhost:3000/ventas?inicio=2024-01-01&fin=2024-12-31' \
  -b cookies.txt
```

#### Registrar Venta

```bash
curl -X POST http://localhost:3000/ventas \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: <token>" \
  -b cookies.txt \
  -d '{
    "productos": "PROD001, PROD002",
    "total_venta": 2450000,
    "vendedor": "admin"
  }'
```

### Gestión de Equipos

#### Listar Estados de Equipo

```bash
curl -X GET http://localhost:3000/estados_equipo \
  -b cookies.txt
```

#### Listar Equipos

```bash
curl -X GET http://localhost:3000/equipos \
  -b cookies.txt
```

#### Asignar Equipo a Usuario

```bash
curl -X POST http://localhost:3000/equipos/asignacion \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: <token>" \
  -b cookies.txt \
  -d '{
    "num_serie": "SN123456",
    "usuario": "trabajador1"
  }'
```

#### Reportar Falla

```bash
curl -X POST http://localhost:3000/equipos/reporte/add \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: <token>" \
  -b cookies.txt \
  -d '{
    "num_serie": "SN123456",
    "falla": "No enciende la pantalla"
  }'
```

#### Listar Mantenimientos

```bash
curl -X GET http://localhost:3000/equipos/mantenimientos \
  -b cookies.txt
```

#### Actualizar Estado de Mantenimiento

```bash
curl -X POST http://localhost:3000/equipos/mantenimientos/update \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: <token>" \
  -b cookies.txt \
  -d '{
    "num_serie": "SN123456",
    "id_historial": 1,
    "tecnico": "Luis García",
    "solucion": "Cambio de pantalla"
  }'
```

---

## 🔐 Seguridad

### Medidas Implementadas

#### 1. Autenticación JWT

- **Almacenamiento**: Cookie HttpOnly (protegida contra XSS)
- **Duración**: 24 horas (configurable)
- **Algoritmo**: HS256
- **Validación**: En cada solicitud a rutas protegidas

#### 2. Protección CSRF

- **Tokens únicos** generados por sesión
- **Validación en**: POST, PUT, DELETE
- **Envío**: Header `x-csrf-token`

#### 3. Control de Acceso (RBAC)

| Rol | Permisos | Endpoints |
|-----|----------|-----------|
| **administrador** | Gestión completa | /usuarios, /productos, /equipos, /ventas, /areas |
| **trabajador** | Acceso general | /productos, /equipos, /ventas, /areas |

#### 4. Rate Limiting

- **Aplicado en**: `/login`
- **Límite**: 5 intentos por 15 segundos
- **Respuesta**: 429 Too Many Requests

#### 5. Validación de Datos

- **Framework**: Joi
- **Aplicado en**: Todos los endpoints POST/PUT
- **Valida**: Tipo, formato, rango, longitud

#### 6. Revocación de Tokens

- **Campo**: `usuarios.token_version`
- **Incremento**: Al hacer logout
- **Efecto**: Invalida todos los tokens previos

### Mejores Prácticas

- ✅ Nunca enviar contraseñas en URLs
- ✅ Usar HTTPS en producción
- ✅ Cambiar JWT_SECRET en `.env`
- ✅ Usar contraseñas fuertes
- ✅ Mantener dependencias actualizadas

---

## 📚 Documentación de API

### Convenciones

- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`
- **Autenticación**: JWT en cookies (automática)
- **CSRF**: Header `x-csrf-token` requerido en POST/PUT/DELETE

### Estructura de Respuesta

#### Respuesta Exitosa

```json
{
  "success": true,
  "data": {},
  "message": "Operación completada"
}
```

#### Respuesta con Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "code": "ERROR_CODE"
}
```

### Códigos de Estado HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - No autorizado |
| 404 | Not Found - Recurso no existe |
| 409 | Conflict - Recurso duplicado |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |

### Endpoints Principales

#### Autenticación

| Método | Endpoint | Descripción | Protegido |
|--------|----------|-------------|-----------|
| GET | `/csrf-token` | Obtener token CSRF | No |
| POST | `/login` | Autenticarse | No |
| POST | `/logout` | Cerrar sesión | Sí |

#### Usuarios

| Método | Endpoint | Descripción | Protegido | Rol Requerido |
|--------|----------|-------------|-----------|--------------|
| GET | `/usuarios` | Listar usuarios | Sí | administrador |
| POST | `/usuarios` | Crear usuario | Sí | administrador |
| PUT | `/usuarios/:usuario` | Actualizar usuario | Sí | administrador |
| DELETE | `/usuarios/:usuario` | Eliminar usuario | Sí | administrador |

#### Productos

| Método | Endpoint | Descripción | Protegido | Rol Requerido |
|--------|----------|-------------|-----------|--------------|
| GET | `/productos` | Listar productos | Sí | Cualquiera |
| GET | `/producto?codigo=...` | Buscar por código | Sí | Cualquiera |
| POST | `/productos` | Crear producto | Sí | administrador |
| PUT | `/productos/:codigo` | Actualizar producto | Sí | administrador |
| DELETE | `/productos/:producto` | Eliminar producto | Sí | administrador |

#### Ventas

| Método | Endpoint | Descripción | Protegido | Parámetros |
|--------|----------|-------------|-----------|-----------|
| GET | `/ventas` | Listar ventas | Sí | `inicio`, `fin` (YYYY-MM-DD) |
| POST | `/ventas` | Crear venta | Sí | `productos`, `total_venta`, `vendedor` |

#### Áreas

| Método | Endpoint | Descripción | Protegido |
|--------|----------|-------------|-----------|
| GET | `/areas` | Listar áreas | Sí |

#### Equipos

| Método | Endpoint | Descripción | Protegido |
|--------|----------|-------------|-----------|
| GET | `/estados_equipo` | Estados disponibles | Sí |
| GET | `/equipos` | Listar equipos | Sí |
| POST | `/equipos/asignacion` | Asignar equipo | Sí |
| POST | `/equipos/reporte/add` | Reportar falla | Sí |
| GET | `/equipos/mantenimientos` | Listar mantenimientos | Sí |
| POST | `/equipos/mantenimientos/update` | Actualizar mantenimiento | Sí |
| POST | `/equipos/mantenimientos/find` | Buscar mantenimientos | Sí |

---

## 🐛 Solución de Problemas

### Error: "Cannot find module 'express'"

**Solución:**
```bash
cd SIVWEB-backend
npm install
```

### Error: "ECONNREFUSED - Connection refused"

**Posible causa:** MySQL no está ejecutándose

```bash
# En Windows
net start MySQL80

# En Linux
sudo systemctl start mysql

# En macOS
brew services start mysql
```

### Error: "Access denied for user"

**Verificar credenciales en `.env`:**
```bash
# Probar conexión manual
mysql -h localhost -u tu_usuario -p
```

### Error: "CORS error"

**Verificar en `.env`:**
```env
CORS_ORIGIN=http://localhost:5173
```

### Error: "Invalid CSRF token"

**Soluciones:**
1. Obtener nuevo token: `GET /csrf-token`
2. Incluir token en header: `x-csrf-token`
3. Enviar cookies con la solicitud

### Error: "Port 3000 already in use"

```bash
# Cambiar puerto en .env
PORT=3001

# O matar proceso en puerto 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9
```

### Frontend no conecta a Backend

**Verificar:**
1. Backend ejecutándose: `http://localhost:3000`
2. VITE_API_URL en `.env` correcto
3. CORS habilitado en backend
4. Cookies compartidas entre dominios

---

## 🤝 Contribución

### Proceso de Contribución

1. **Fork** del repositorio
2. **Crear rama** para la característica: `git checkout -b feature/mi-caracteristica`
3. **Commitear cambios**: `git commit -am 'Agregar característica'`
4. **Push a rama**: `git push origin feature/mi-caracteristica`
5. **Crear Pull Request**

### Estándares de Código

- Usar comillas simples en JavaScript/TypeScript
- Indentación de 2 espacios
- Nombres descriptivos en inglés o español (consistente)
- Comentarios para lógica compleja
- Tests unitarios para nuevas funciones

---

## 📞 Soporte y Contacto

Para reportar bugs o hacer sugerencias, crear un [Issue](https://github.com/IngSistemasAndersonBaes/SIVWEB/issues) en el repositorio.

---

## 📄 Licencia

Este proyecto está bajo licencia privada. Todos los derechos reservados.

---

**Última actualización:** 2026-05-28
**Versión de documentación:** 2.0
**Autor:** IngSistemasAndersonBaes
