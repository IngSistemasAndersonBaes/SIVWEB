create database db_inv_ti;
use db_inv_ti;

create table areas(
    area varchar(100) primary key
);

create table estados_equipo(
    estado varchar(50) primary key
);

create table usuarios(
    usuario varchar(20) primary key,
    contrasena varchar(255) not null,
    nombre varchar(200) not null,
    area varchar(100) not null,
    correo varchar(50) null,
    estado varchar(15) not null
);

create table equipos(
    num_serie varchar(50) primary key,
    equipo varchar(100) not null,
    area varchar(100) not null,
    descripcion text,
    estado varchar(50) not null,
    responsable varchar(20) null,
    fecha_adquisicion date not null,
    fecha_asignacion date not null,
    fecha_baja date not null
);

create table historial_mantenimientos(
    id_historial varchar(100) primary key,
    num_serie varchar(50) not null,
    fecha_reporte date not null,
    fecha_solucion date null,
    usuario_tecnico varchar(20) null,
    falla text not null,
    solucion text null
);

create table productos(
    codigo varchar(50) primary key,
    nom_producto varchar(100) not null,
    desc_producto text not null,
    pre_publico double not null,
    pre_proveedor double not null,
    existencias int not null
);

create table ventas(
    id_venta varchar(150) primary key,
    productos text not null,
    total_venta double not null,
    fecha_venta date not null,
    vendedor varchar(20) not null
);

create table audit_logs(
    id int auto_increment primary key,
    usuario varchar(20) null,
    metodo varchar(10) not null,
    ruta varchar(200) not null,
    status int not null,
    ip varchar(45) null,
    creado_en timestamp default current_timestamp
);

insert into areas (area) values
('Jefe'),
('Gerente'),
('Tecnologia'),
('Administracion'),
('Recursos Humanos'),
('Finanzas'),
('Almacen'),
('Ventas');

insert into estados_equipo (estado) values
('activo'),
('mantenimiento'),
('baja'),
('inactivo'),
('reservado');

insert into usuarios (usuario, contrasena, nombre, area, correo, estado) values
('admin', '$2b$10$67x0vMxexoVGa3tj7Hq/IeWaks5w6m6G9JZ4R.NkPfiwMeeNgprKG', 'Administrador General', 'Jefe', 'admin@empresa.com', 'activo'),
('gerenteadmin', '$2b$10$L5JTkyRZifHixIKYeYedReXC2figjVLLDqOhe6.RBWlnJy1jNzWEW', 'Gerencia General', 'Gerente', 'gerencia@empresa.com', 'activo'),
('jefe1', '$2b$10$5Isgv7uU7N7vNt1vY7SGwejuUe7WkZ1ilpCMsjAygulPin1sKOOHq', 'Luis Herrera', 'Jefe', 'jefe@empresa.com', 'activo'),
('gerente1', '$2b$10$Ac6pQY1tyVM5/SzNGoik0OV3cHDfY33PrCkR76LNpWXC3PZqdWQnO', 'Marta Ramos', 'Gerente', 'gerente@empresa.com', 'activo'),
('crod', '$2b$10$j4RZg6PbAHtwcbknroBD1uHEZsRcp4TsRlrLsi9wZOuwu..U0F0EK', 'Carlos Rodriguez', 'Tecnologia', 'carlos.rodriguez@empresa.com', 'activo'),
('jperez', '$2b$10$OOcN5VHVVIyt0lnGmwVYhOw6/cYNe4uLgs/5RIw3hrkk.YV.8.4nS', 'Juan Perez', 'Administracion', 'juan.perez@empresa.com', 'activo'),
('rlopez', '$2b$10$LYigGpYYUJIIYZwOaqX2E.X34ViYRlH6OpgmY6qgUb5nQsA5VJF8S', 'Rosa Lopez', 'Recursos Humanos', 'rosa.lopez@empresa.com', 'activo'),
('psanchez', '$2b$10$dinlqGKspr152YMh0jcR.eQPuqsFsUWYccZF9f89HiVfWUr3z0kEa', 'Pedro Sanchez', 'Finanzas', 'pedro.sanchez@empresa.com', 'activo'),
('amendoza', '$2b$10$G8Dvt1EBz09UWEJV0ni7IOabb0r/XBxKhwVH4SROtztqqSjA.EyAa', 'Ana Mendoza', 'Almacen', 'ana.mendoza@empresa.com', 'activo'),
('llopez', '$2b$10$dZmFiZCgv84UmrHlDRS4C.TQilGhLliqVNvNgUmvCUmzV/uJ7UoUW', 'Laura Lopez', 'Ventas', 'laura.lopez@empresa.com', 'inactivo');

insert into productos (codigo, nom_producto, desc_producto, pre_publico, pre_proveedor, existencias) values
('H001', 'Detergente Liquido 4.65L', 'Detergente liquido para ropa con poder quitamanchas, presentacion familiar', 189.00, 150.00, 60),
('H002', 'Papel Higienico Rollos', 'Papel higienico doble hoja, ultra suave, paquete economico', 189.00, 150.00, 100),
('H003', 'Limpiador Multiusos', 'Limpiador multiusos con aroma a lavanda, ideal para pisos y superficies', 35.00, 20.00, 75),
('H004', 'Esponjas Multiusos Pack x3', 'Esponjas multiusos resistentes para cocina y bano', 28.00, 18.00, 80),
('H005', 'Trapeador Palo', 'Trapeador ultra absorbente con cabezal giratorio', 75.00, 50.00, 35),
('H006', 'Vasos x6', 'Vasos resistentes y elegantes para bebidas frias', 95.00, 70.00, 20),
('H007', 'Sarten Antiadherente', 'Sarten de aluminio con recubrimiento antiadherente y mango ergonomico', 120.00, 80.00, 15),
('H008', 'Aromatizante Canela 275g', 'Aerosol aromatizante para el hogar', 32.00, 22.00, 50),
('H009', 'Basurero 25L', 'Contenedor de plastico resistente con pedal y tapa hermetica', 110.00, 80.00, 10),
('H010', 'Toallas Reutilizables x3', 'Toallas de tela absorbente reutilizables para cocina', 48.00, 30.00, 45);

insert into equipos (num_serie, equipo, area, descripcion, estado, responsable, fecha_adquisicion, fecha_asignacion, fecha_baja) values
('E001', 'Laptop Dell XPS 13', 'Tecnologia', 'Laptop de alto rendimiento para desarrollo', 'activo', 'crod', '2023-01-01', '2023-01-01', '1900-01-01'),
('E002', 'Monitor Samsung 27', 'Tecnologia', 'Monitor 4K de 27 pulgadas', 'activo', null, '2023-01-01', '2023-01-01', '1900-01-01'),
('E003', 'Impresora HP LaserJet', 'Administracion', 'Impresora multifuncional blanco y negro', 'mantenimiento', 'jperez', '2023-02-15', '2023-02-20', '1900-01-01'),
('E004', 'Router Cisco', 'Tecnologia', 'Router empresarial para oficina central', 'activo', 'crod', '2023-03-10', '2023-03-15', '1900-01-01'),
('E005', 'Servidor Dell PowerEdge', 'Tecnologia', 'Servidor de base de datos', 'activo', 'crod', '2022-11-20', '2022-12-01', '1900-01-01'),
('E006', 'Tablet iPad Pro', 'Ventas', 'Tablet para presentaciones comerciales', 'inactivo', 'llopez', '2023-04-05', '2023-04-10', '2023-12-15'),
('E007', 'Teclado mecanico Logitech', 'Tecnologia', 'Teclado mecanico para programacion', 'activo', null, '2023-05-12', '2023-05-15', '1900-01-01'),
('E008', 'Switch Netgear 24 puertos', 'Tecnologia', 'Switch gestionable para rack', 'reservado', 'crod', '2023-06-18', '1900-01-01', '1900-01-01'),
('E009', 'Disco duro externo 2TB', 'Administracion', 'Almacenamiento para backups', 'baja', null, '2022-08-22', '2022-09-01', '2023-10-30'),
('E010', 'Proyector Epson', 'Administracion', 'Proyector para presentaciones', 'mantenimiento', 'jperez', '2023-07-07', '2023-07-10', '1900-01-01');

insert into historial_mantenimientos (id_historial, num_serie, fecha_reporte, fecha_solucion, usuario_tecnico, falla, solucion) values
('HIST001', 'E003', '2023-03-01', '2023-03-05', 'crod', 'Atasco de papel en impresora', 'Se realizo limpieza interna y reemplazo de rodillo'),
('HIST002', 'E010', '2023-08-01', '2023-08-03', 'crod', 'Proyector no enciende', 'Cambio de lampara y revision de fuente de poder'),
('HIST003', 'E002', '2023-05-20', '2023-05-22', 'crod', 'Pantalla con pixeles muertos', 'Se gestiono garantia y reemplazo del panel'),
('HIST004', 'E006', '2023-12-10', '2023-12-15', 'crod', 'Tablet no carga bateria', 'Reemplazo de bateria y actualizacion de firmware'),
('HIST005', 'E008', '2023-07-01', '2023-07-04', 'crod', 'Switch presenta desconexiones aleatorias', 'Actualizacion de firmware y cambio de cables defectuosos');

