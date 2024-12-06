-- CREACION DE BASE DE DATOS

-- create database [GDA004-OT-DavidSian];

-- CREACION DE TABLAS Y LLAVES PRIMARIAS

-- Creacion de tabla Productos

create table Productos(
	idProductos int identity(1,1) not null,
	CategoriaProductos_idCategoriaProductos int not null,
	usuarios_idusuarios int not null,
	nombre varchar(45),
	marca varchar(45),
	codigo varchar(45),
	stock float,
	estados_idestados int not null,
	precio float,
	fecha_creacion datetime,
	foto binary
);

-- Creacion de llave primaria

alter table Productos
add constraint PK_Productos_id primary key(idProductos);

-- Creacion de tabla OrdenDetalles

create table OrdenDetalles(
	idOrdenDetalles int identity(1,1) not null,
	Orden_idOrden int not null,
	Productos_idProductos int not null,
	cantidad int,
	precio float,
	subtotal float
);

-- Creacion de llave primaria

alter table OrdenDetalles
add constraint PK_OrdenDetalles_id primary key(idOrdenDetalles);

-- Creacion de tabla orden

create table Orden(
	idOrden int identity(1,1) not null,
	usuarios_idusuarios int not null,
	estados_idestados int not null,
	fecha_creacion datetime,
	nombre_completo varchar(45),
	direccion varchar(545),
	telefono varchar(45),
	correo_electronico varchar(45),
	fecha_entrega date,
	total_orden float
);

-- creacion de llave primaria

alter table Orden
add constraint PK_Orden_id primary key(idOrden);

-- Creacion de tabla usuarios

create table usuarios(
	idusuarios int identity(1,1) not null,
	rol_idrol int not null,
	estados_idestados int not null,
	correo_electronico varchar(45),
	nombre_completo varchar(60),
	user_password varchar(45),
	telefono varchar(45),
	fecha_nacimiento date,
	fecha_creacion datetime,
	Clientes_idClientes int 
);

-- Creacion de llave primaria

alter table usuarios
add constraint PK_usuarios_id primary key(idusuarios);

-- Creacion de tabla Productos

create table CategoriaProductos(
	idCategoriaProductos int identity(1,1) not null,
	usuarios_idusuarios int not null,
	nombre varchar(45),
	estados_idestados int not null,
	fecha_creacion datetime
);

-- Creacion de llave primaria

alter table CategoriaProductos
add constraint PK_CategoriaProductos_id primary key(idCategoriaProductos);

-- Creacion de tabla rol

create table rol(
	idrol int identity(1,1) not null,
	nombre varchar(45),
);

-- Creacion de llave primaria

alter table rol
add constraint PK_rol_id primary key(idrol);

-- Creacion de tabla estados

create table estados(
	idestados int identity(1,1) not null,
	nombre varchar(45),
);

-- Creacion de llave primaria

alter table estados
add constraint PK_estados_id primary key(idestados);

-- Creacion de tabla Clientes

create table Clientes(
	idClientes int identity(1,1) not null,
	razon_social varchar(45),
	nombre_comercial varchar(45),
	direccion_entrega varchar(45),
	telefono varchar(45),
	email varchar(45),
);

-- Creacion de llave primaria

alter table Clientes
add constraint PK_Clientes_id primary key(idClientes);

-- CREACION DE LLAVES FORANEAS PARA LA TABLA PRODUCTOS

alter table Productos
add constraint FK_Productos_CategoriaProductos foreign key(CategoriaProductos_idCategoriaProductos)
references CategoriaProductos (idCategoriaProductos);

alter table Productos
add constraint FK_Productos_usuarios foreign key(usuarios_idusuarios)
references usuarios (idusuarios);

alter table Productos
add constraint FK_Productos_estados foreign key (estados_idestados)
references estados (idestados);

-- CREACION DE LLAVES FORANEAS PARA LA TABLA ORDENDETALLES

alter table OrdenDetalles
add constraint FK_OrdenDetalles_Orden foreign key(Orden_idOrden)
references Orden (idOrden);

alter table OrdenDetalles
add constraint FK_OrdenDetalles_Productos foreign key(Productos_idProductos)
references Productos (idProductos);

-- CREACION DE LLAVES FORANEAS PARA LA TABLA USUARIOS

alter table usuarios
add constraint FK_usuarios_rol foreign key(rol_idrol)
references rol (idrol);

alter table usuarios
add constraint FK_usuarios_estados foreign key(estados_idestados)
references estados (idestados);

alter table usuarios
add constraint FK_usuarios_Clientes foreign key(Clientes_idClientes)
references Clientes (idClientes);

-- CREACION DE LLAVES FORANEAS PARA LA TABLA ORDEN

alter table Orden 
add constraint FK_Orden_usuarios foreign key(usuarios_idusuarios)
references usuarios (idusuarios);

alter table Orden
add constraint FK_Orden_estados foreign key(estados_idestados)
references estados (idestados);

-- CREACION DE LLAVES FORANEAS PARA LA TABLA CATEGORIAPRODUCTOS

alter table CategoriaProductos
add constraint FK_CategoriaProductos_usuarios foreign key(usuarios_idusuarios)
references usuarios (idusuarios);

alter table CategoriaProductos
add constraint FK_CategoriaProductos_estados foreign key(estados_idestados)
references estados (idestados);

-- INSERCION DE DATOS

INSERT INTO estados (nombre) 
VALUES ('Activo'),('Inactivo');

INSERT INTO rol (nombre) 
VALUES ('Administrador'),('Usuario');

INSERT INTO Clientes (razon_social, nombre_comercial, direccion_entrega, telefono, email) 
VALUES ('Cliente_A', 'Comercial_A', 'Direccion_A', '4324-4324', 'clientea@example.com');

INSERT INTO usuarios (rol_idrol, estados_idestados, correo_electronico, nombre_completo, user_password, telefono, fecha_nacimiento, fecha_creacion, Clientes_idClientes)
VALUES (1, 1, 'admin@example.com', 'Administrador', 0xA1B2C3D4, '1234567890', '1980-01-01', GETDATE(), 1);

INSERT INTO CategoriaProductos (usuarios_idusuarios, nombre, estados_idestados, fecha_creacion)
VALUES (1, 'Electrónica', 1, GETDATE());

INSERT INTO Productos (CategoriaProductos_idCategoriaProductos, usuarios_idusuarios, nombre, marca, codigo, stock, estados_idestados, precio, fecha_creacion, foto)
VALUES (1, 1, 'Laptop', 'Marca A', 'ABC123', 10, 1, 999.99, GETDATE(), NULL);

INSERT INTO Orden (usuarios_idusuarios, estados_idestados, fecha_creacion, nombre_completo, direccion, telefono, correo_electronico, fecha_entrega, total_orden)
VALUES (1, 1, GETDATE(), 'Cliente A', 'Dirección A', '1234567890', 'clientea@example.com', '2023-12-31', 1999.98);

INSERT INTO OrdenDetalles (Orden_idOrden, Productos_idProductos, cantidad, precio, subtotal)
VALUES (1, 1, 2, 999.99, 1999.98);

