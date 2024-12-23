/*
	Estructura de la query

	1. CREACION DE BASE DE DATOS
	2. CREACION DE TABLAS, CAMPOS Y LLAVES PRIMARIAS
	3. CREACION DE LLAVES FORANEAS Y RELACIONES ENTRE TABLAS
	4. CREACION DE PROCEDIMIENTOS ALMACENADOS (INSERTAR EN TABLA, ACTUALIZAR CAMPO DE TABLAS Y ELIMINAR CAMPOS)
	5. CREACION DE VISTAS 
	6. INSERTAR DATOS EN LAS TABLAS UTILIZANDO LOS PROCEDIMIENTOS
*/

-- 1. CREACION DE BASE DE DATOS

CREATE DATABASE [GDA004-OT-DavidSian];

USE [GDA004-OT-DavidSian];

SELECT * From usuarios;
-- 2. CREACION DE TABLAS, CAMPOS Y LLAVES PRIMARIAS

-- Creacion de tabla Productos

CREATE TABLE Productos(
	idProductos int identity(1,1) not null,
	CategoriaProductos_idCategoriaProductos int ,
	usuarios_idusuarios int,
	nombre varchar(45),
	marca varchar(45),
	codigo varchar(45),
	stock float,
	estados_idestados int,
	precio float,
	fecha_creacion datetime,
	foto binary
);

-- Creacion de llave primaria

ALTER TABLE Productos
ADD CONSTRAINT PK_Productos_id PRIMARY KEY(idProductos),
CONSTRAINT DT_Fecha_Creacion_Productos default getdate() for fecha_creacion;


-- Creacion de tabla orden
CREATE TABLE Orden(
  idOrden INT IDENTITY PRIMARY KEY,
  idusuarios INT NOT NULL,
  estados_idestados INT NOT NULL,
  nombre_completo NVARCHAR(255),
  direccion NVARCHAR(255),
  telefono NVARCHAR(50),
  correo_electronico NVARCHAR(255),
  fecha_creacion DATETIME DEFAULT GETDATE(),
  fecha_entrega DATETIME,
  total_orden DECIMAL(10, 2),
  Clientes_idClientes INT NOT NULL
);

-- Creacion de tabla OrdenDetalles
CREATE TABLE OrdenDetalles(
	idOrdenDetalles INT IDENTITY PRIMARY KEY,
  idOrden INT NOT NULL,
  idProductos INT NOT NULL,
  cantidad INT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  subtotal AS (cantidad * precio) PERSISTED,
  FOREIGN KEY (idOrden) REFERENCES Orden(idOrden)
);


-- Creacion de tabla usuarios

CREATE TABLE usuarios(
	idusuarios int identity(1,1) not null,
	rol_idrol int,
	estados_idestados int,
	correo_electronico varchar(45),
	nombre_completo varchar(60),
	user_password varchar(45),
	telefono varchar(45),
	fecha_nacimiento date,
	fecha_creacion datetime,
	Clientes_idClientes int 
);

-- Creacion de llave primaria

ALTER TABLE usuarios
ADD CONSTRAINT PK_usuarios_id PRIMARY KEY(idusuarios);

-- Creacion de tabla Productos

CREATE TABLE CategoriaProductos(
	idCategoriaProductos int identity(1,1) not null,
	usuarios_idusuarios int,
	nombre varchar(45),
	estados_idestados int,
	fecha_creacion datetime
);

-- Creacion de llave primaria

ALTER TABLE CategoriaProductos
ADD CONSTRAINT PK_CategoriaProductos_id PRIMARY KEY(idCategoriaProductos);

-- Creacion de tabla rol

CREATE TABLE rol(
	idrol int identity(1,1) not null,
	nombre varchar(45),
);

-- Creacion de llave primaria

ALTER TABLE rol
ADD CONSTRAINT PK_rol_id PRIMARY KEY(idrol);

-- Creacion de tabla estados

CREATE TABLE estados(
	idestados int identity(1,1) not null,
	nombre varchar(45),
);

-- Creacion de llave primaria

ALTER TABLE estados
ADD CONSTRAINT PK_estados_id PRIMARY KEY(idestados);

-- Creacion de tabla Clientes

CREATE TABLE Clientes(
	idClientes int identity(1,1) not null,
	razon_social varchar(45),
	nombre_comercial varchar(45),
	direccion_entrega varchar(45),
	telefono varchar(45),
	email varchar(45),
);

-- Creacion de llave primaria

ALTER TABLE Clientes
ADD CONSTRAINT PK_Clientes_id PRIMARY KEY(idClientes);

-- 3. CREACION DE LLAVES FORANEAS Y RELACIONES ENTRE TABLAS

--  CREACION DE LLAVES FORANEAS PARA LA TABLA PRODUCTOS

ALTER TABLE Productos
ADD CONSTRAINT FK_Productos_CategoriaProductos foreign key(CategoriaProductos_idCategoriaProductos)
REFERENCES CategoriaProductos (idCategoriaProductos),

CONSTRAINT FK_Productos_usuarios foreign key(usuarios_idusuarios)
REFERENCES usuarios (idusuarios),

CONSTRAINT FK_Productos_estados foreign key (estados_idestados)
REFERENCES estados (idestados);

-- CREACION DE LLAVES FORANEAS PARA LA TABLA ORDENDETALLES

ALTER TABLE OrdenDetalles
ADD CONSTRAINT FK_OrdenDetalles_Orden foreign key(Orden_idOrden)
REFERENCES Orden (idOrden),

CONSTRAINT FK_OrdenDetalles_Productos foreign key(Productos_idProductos)
REFERENCES Productos (idProductos);

-- CREACION DE LLAVES FORANEAS PARA LA TABLA USUARIOS

ALTER TABLE usuarios
ADD CONSTRAINT FK_usuarios_rol foreign key(rol_idrol)
REFERENCES rol (idrol),

CONSTRAINT FK_usuarios_estados foreign key(estados_idestados)
REFERENCES estados (idestados),

CONSTRAINT FK_usuarios_Clientes foreign key(Clientes_idClientes)
REFERENCES Clientes (idClientes);

-- CREACION DE LLAVES FORANEAS PARA LA TABLA ORDEN

ALTER TABLE Orden 
ADD CONSTRAINT FK_Orden_usuarios foreign key(usuarios_idusuarios)
REFERENCES usuarios (idusuarios),

CONSTRAINT FK_Orden_estados foreign key(estados_idestados)
REFERENCES estados (idestados),

CONSTRAINT FK_Orden_Clientes foreign key (Clientes_idClientes) 
REFERENCES Clientes(idClientes);

-- CREACION DE LLAVES FORANEAS PARA LA TABLA CATEGORIAPRODUCTOS

ALTER TABLE CategoriaProductos
ADD CONSTRAINT FK_CategoriaProductos_usuarios foreign key(usuarios_idusuarios)
REFERENCES usuarios (idusuarios),

CONSTRAINT FK_CategoriaProductos_estados foreign key(estados_idestados)
REFERENCES estados (idestados);

/*
	4. PROCEDIMIENTOS ALMACENADOS

	Los procedimientos almacenados estan ordenados por tablas, cada tabla tiene su 
	procedimiento y un ejemplo de uso.
	Cada campo de las tablas contiene su propio update por si no se desea alterar toda
	la tabla.

*/

-- Procedimientos tabla Clientes

CREATE OR ALTER PROC insertClientes(
	@razon_s varchar(45),
	@nombre_com varchar(45),
	@direccion_en varchar(45),
	@telefono varchar(45),
	@email varchar(45)
)
AS
BEGIN
	INSERT INTO Clientes (razon_social, nombre_comercial, direccion_entrega, telefono, email)
	VALUES (@razon_s, @nombre_com, @direccion_en, @telefono, @email);
END;

-- exec insertClientes 'Una razon', 'Un nombre comercial', 'Avenida los Mijares', '3545-2345', 'alguien@email.com';


CREATE OR ALTER PROC updateClientes(
	@idCliente int,
	@razon_s varchar(45),
	@nombre_com varchar(45),
	@direccion_en varchar(45),
	@telefono varchar(45),
	@email varchar(45)
)
AS
BEGIN
	UPDATE Clientes 
	SET razon_social=@razon_s, 
		nombre_comercial=@nombre_com, 
		direccion_entrega=@direccion_en, 
		telefono=@telefono, 
		email=@email
	WHERE idClientes = @idCliente
END;

-- exec updateClientes 'Una razon', 'Un nombre comercial', 'Avenida los Mijares', '3545-2345', 'alguien@email.com';


-- Elimnar clientes

CREATE OR ALTER PROC deleteClientes(
	@idCliente int
)
AS
BEGIN TRANSACTION
	UPDATE Orden 
	SET Clientes_idclientes = NULL
	WHERE Clientes_idclientes = @idCliente
	UPDATE usuarios
	SET Clientes_idclientes = NULL
	WHERE Clientes_idclientes = @idCliente

	DELETE FROM  Clientes
	WHERE idClientes = @idCliente
	DELETE FROM  Orden
	WHERE Clientes_idclientes = @idCliente
	DELETE FROM  usuarios
	WHERE Clientes_idclientes = @idCliente
COMMIT TRANSACTION;

-- exec deleteClientes 1;

-- Creacion de procedimientos para Productos

CREATE OR ALTER PROC insertProductos(
	@CategoriaProductos_id int,
	@usuarios_id int,
	@nombre varchar(45),
	@marca varchar(45),
	@codigo varchar(45),
	@stock float,
	@estados_id int,
	@precio float,
	@fecha_creacion datetime,
	@foto binary
)
AS
BEGIN
	INSERT INTO Productos (CategoriaProductos_idCategoriaProductos, usuarios_idusuarios, nombre, marca, codigo, stock, estados_idestados, precio, fecha_creacion, foto)
	VALUES (@CategoriaProductos_id, @usuarios_id, @nombre, @marca, @codigo, @stock, @estados_id, @precio, @fecha_creacion, @foto)
END;

-- exec insertProductos 1, 1, 'Monitor 27"', 'Acer', '84923SDF', 15, 1, 3000, null;

CREATE OR ALTER PROC updateProductos(
	@idProducto int,
	@CategoriaProductos_id int,
	@usuarios_id int,
	@nombre varchar(45),
	@marca varchar(45),
	@codigo varchar(45),
	@stock float,
	@estados_id int,
	@precio float,
	@fecha_creacion datetime,
	@foto binary
)
AS
BEGIN
	UPDATE Productos 
	SET CategoriaProductos_idCategoriaProductos= colease @CategoriaProductos_id,
		usuarios_idusuarios= colease @usuarios_id, 
		nombre= colease @nombre, marca= colease @marca, 
		codigo= colease @codigo, 
		stock= colease @stock, 
		estados_idestados= colease @estados_id, 
		precio= colease @precio, 
		fecha_creacion =  colease fecha_creacion,
		foto= colease @foto
	WHERE idProductos=@idProducto;
END;

-- exec insertProductos 1, 1, 'Monitor 27"', 'Acer', '84923SDF', 15, 1, 3000, null;


CREATE OR ALTER PROC updateProducto_idestados(
	@Producto_id int,
	@NuevoEstado int
)
AS
BEGIN
	UPDATE Productos
	SET estados_idestados = @NuevoEstado
	WHERE idProductos = @Producto_id
END;

-- exec updateProducto_idestados 1,1;



-- Eliminar Productos

CREATE OR ALTER PROC DeleteProduct(
	@idProducto int
)
AS
BEGIN TRANSACTION
	UPDATE OrdenDetalles SET Productos_idProductos = null
	WHERE Productos_idProductos = @idProducto
	DELETE FROM Productos
	WHERE idProductos = @idProducto
	DELETE FROM OrdenDetalles
	WHERE Productos_idProductos = @idProducto
COMMIT TRANSACTION;

-- exec DeleteProduct 1;

-- Creacion de Procedimientos para usuarios

CREATE OR ALTER PROC insertUsuarios(
	@rol_idrol int,
	@estados_id int,
	@correo varchar(45),
	@nombre varchar(60),
	@user_pass varchar(45),
	@telefono varchar(45),
	@fecha date,
	@fecha_creacion datetime,
	@clientes_id int
)
AS
BEGIN
	INSERT INTO usuarios (rol_idrol, estados_idestados, correo_electronico, nombre_completo, user_password, telefono, fecha_nacimiento, fecha_creacion, Clientes_idClientes)
	VALUES (@rol_idrol, @estados_id, @correo, @nombre, @user_pass, @telefono, @fecha, @fecha_creacion, @clientes_id)
END;

-- exec insertUsuarios 1, 1, 'algunusuario@example.com', 'Mariano Perez', 'DKLFJSL3', '3213-1233', '1993-01-01', null;
CREATE OR ALTER PROC updateUsuarios(
    @idUsuario int,
    @rol_idrol int = NULL,
    @estados_id int = NULL,
    @correo varchar(45) = NULL,
    @nombre varchar(60) = NULL,
    @user_pass varchar(60) = NULL,
    @telefono varchar(45) = NULL,
    @fecha date = NULL,
    @fecha_creacion datetime = NULL,
    @clientes_id int = NULL
)
AS
BEGIN
    UPDATE usuarios 
    SET rol_idrol = COALESCE(@rol_idrol, rol_idrol),
        estados_idestados = COALESCE(@estados_id, estados_idestados),
        correo_electronico = COALESCE(@correo, correo_electronico),
        nombre_completo = COALESCE(@nombre, nombre_completo),
        user_password = COALESCE(@user_pass, user_password),
        telefono = COALESCE(@telefono, telefono),
        fecha_nacimiento = COALESCE(@fecha, fecha_nacimiento),
        fecha_creacion = COALESCE(@fecha_creacion, fecha_creacion),
        Clientes_idClientes = COALESCE(@clientes_id, Clientes_idClientes)
    WHERE idusuarios = @idUsuario
END;

-- exec updateUsuarios 1, 1, 1, 'algunusuario@example.com', 'Mariano Perez', 'DKLFJSL3', '3213-1233', '1993-01-01', null;



CREATE OR ALTER PROC updateUsuario_Rol(
	@idusuario int,
	@nuevoRol int
)
AS
BEGIN
	UPDATE usuarios
	SET rol_idrol = @nuevoRol
	WHERE idusuarios = @idusuario
END;

-- exec updateUsuario_Rol 1, 1;

CREATE OR ALTER PROC updateUsuario_Estado(
	@idusuario int,
	@nuevoEstado int
)
AS
BEGIN
	UPDATE usuarios
	SET estados_idestados = @nuevoEstado
	WHERE idusuarios = @idusuario
END;

-- exec updateUsuario_Estado 1, 1;

CREATE OR ALTER PROC updateUsuario_Correo(
	@idusuario int,
	@nuevoCorreo varchar(45)
)
AS
BEGIN
	UPDATE usuarios
	SET correo_electronico = @nuevoCorreo
	WHERE idusuarios = @idusuario
END;

-- exec updateUsuario_Correo 1, 'NuevoCorreooo@email.com';

CREATE OR ALTER PROC updateUsuario_Nombre(
	@idusuario int,
	@nuevoNombre varchar(60)
)
AS
BEGIN
	UPDATE usuarios
	SET nombre_completo = @nuevoNombre
	WHERE idusuarios = @idusuario
END;

-- exec updateUsuario_Nombre 1, 'Ola Nuevo Nombre Juan';

CREATE OR ALTER PROC updateUsuario_Password(
	@idusuario int,
	@nuevoPassword varchar(45)
)
AS
BEGIN
	UPDATE usuarios
	SET user_password = @nuevoPassword
	WHERE idusuarios = @idusuario
END;

-- exec updateUsuario_Password 1, 'EstaesunaNuevaPass';

CREATE OR ALTER PROC updateUsuario_Telefono(
	@idusuario int,
	@nuevoTelefono varchar(45)
)
AS
BEGIN
	UPDATE usuarios
	SET telefono = @nuevoTelefono
	WHERE idusuarios = @idusuario
END;

-- exec updateUsuario_Telefono 1, '2111-0043';

CREATE OR ALTER PROC updateUsuario_fechaNacimiento(
	@idusuario int,
	@nuevaFechaNacimiento date
)
AS
BEGIN
	UPDATE usuarios
	SET fecha_nacimiento = @nuevaFechaNacimiento
	WHERE idusuarios = @idusuario
END;

-- exec updateUsuario_fechaNacimiento 1, '1995-12-12';

CREATE OR ALTER PROC updateUsuario_idClientes(
	@idusuario int,
	@nuevoClienteid int
)
AS
BEGIN
	UPDATE usuarios
	SET Clientes_idClientes = @nuevoClienteid
	WHERE idusuarios = @idusuario
END;

-- exec updateUsuario_idClientes 1, 1;

-- Eliminar usuario

CREATE OR ALTER PROC deleteUser(
	@idUsuario int
)
AS
BEGIN TRANSACTION
	UPDATE Orden 
	SET usuarios_idusuarios = NULL
	WHERE usuarios_idusuarios = @idUsuario
	UPDATE Productos
	SET usuarios_idusuarios = NULL
	WHERE usuarios_idusuarios = @idUsuario
	UPDATE CategoriaProductos
	SET usuarios_idusuarios = NULL
	WHERE usuarios_idusuarios = @idUsuario
	DELETE FROM  usuarios
	WHERE idusuarios = @idUsuario
	DELETE FROM  Orden
	WHERE usuarios_idusuarios = @idUsuario
	DELETE FROM  Productos
	WHERE usuarios_idusuarios = @idUsuario
	DELETE FROM  CategoriaProductos
	WHERE usuarios_idusuarios = @idUsuario
COMMIT TRANSACTION;


-- exec insertOrden 1, 1, 'Joe Marino', 'Calle 83, avenida 1', '8291-4822', 'ordenmail@gmail.com', '2024-12-12', '2024-08-12', 312.32, 1;

CREATE OR ALTER PROC updateOrden(
    @idOrden int,
    @usuario_id int NULL,
    @estados_id int NULL,
    @nombre varchar(45) NULL,
    @direccion varchar(45) NULL,
    @telefono varchar(45) NULL,
    @correo varchar(45) NULL,
    @fecha_entrega date NULL,
    @Clientes_id int NULL
)
AS
BEGIN
    UPDATE Orden
    SET idusuarios = COALESCE(@usuario_id, idusuarios),
        estados_idestados = COALESCE(@estados_id, estados_idestados),
        nombre_completo = COALESCE(@nombre, nombre_completo),
        direccion = COALESCE(@direccion, direccion),
        telefono = COALESCE(@telefono, telefono),
        correo_electronico = COALESCE(@correo, correo_electronico),
        fecha_entrega = COALESCE(@fecha_entrega, fecha_entrega),
        Clientes_idclientes = COALESCE(@Clientes_id, Clientes_idclientes)
    WHERE idOrden = @idOrden
END;


-- exec updateOrden 1, 1, 1, 'Joe Marino', 'Calle 83, avenida 1', '8291-4822', 'ordenmail@gmail.com', '2024-12-12', 312.32, 1;


-- Orden Detalles con OpenJson para insertar multiples productos


CREATE OR ALTER PROCEDURE InsertarOrdenConDetallesJSON
    @idusuarios INT,
    @estados_idestados INT,
    @nombre_completo NVARCHAR(255),
    @direccion NVARCHAR(255),
    @telefono NVARCHAR(50),
    @correo_electronico NVARCHAR(255),
    @fecha_entrega DATETIME,
    @Clientes_idClientes INT,
    @DetallesProductos NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

    BEGIN TRY
        -- Insertar la orden principal
        INSERT INTO Orden (
            idusuarios, estados_idestados, nombre_completo, direccion, telefono, 
            correo_electronico, fecha_entrega, Clientes_idClientes
        )
        VALUES (
            @idusuarios, @estados_idestados, @nombre_completo, @direccion, 
            @telefono, @correo_electronico, @fecha_entrega, @Clientes_idClientes
        );

        DECLARE @idOrden INT = SCOPE_IDENTITY();

        -- Insertar los detalles de productos usando OpenJSON
        INSERT INTO OrdenDetalles (idOrden, idProductos, cantidad, precio)
        SELECT 
            @idOrden AS idOrden,
            JSON_VALUE(value, '$.idProductos') AS idProductos,
            JSON_VALUE(value, '$.cantidad') AS cantidad,
            JSON_VALUE(value, '$.precio') AS precio
        FROM OPENJSON(@DetallesProductos);

		-- Calcular el total_orden sumando los subtotales de OrdenDetalles
        UPDATE Orden
        SET total_orden = (
            SELECT SUM(cantidad * precio)
            FROM OrdenDetalles
            WHERE idOrden = @idOrden
        )
        WHERE idOrden = @idOrden;

        -- Confirmar transacción
        COMMIT TRANSACTION;

        SELECT @idOrden AS idOrden; -- Retorna el ID de la orden creada
    END TRY
    BEGIN CATCH
        -- Revertir transacción en caso de error
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;


DECLARE @DetallesProductos1 NVARCHAR(MAX) = '[
    { "idProductos": 1, "cantidad": 2, "precio": 150.00 },
    { "idProductos": 2, "cantidad": 1, "precio": 300.00 },
    { "idProductos": 3, "cantidad": 4, "precio": 75.50 }
]';

EXEC InsertarOrdenConDetallesJSON
    @idusuarios = 1,
    @estados_idestados = 2,
    @nombre_completo = 'Juan Pérez',
    @direccion = 'Av. Principal #123',
    @telefono = '1234567890',
    @correo_electronico = 'juan.perez@example.com',
    @fecha_entrega = '2024-12-25',
    @Clientes_idClientes = 1,
    @DetallesProductos = @DetallesProductos1;


CREATE OR ALTER PROC updateOrden_idestado(
	 @idOrden int,
	 @nuevoidestado int
)
AS
BEGIN
	UPDATE Orden
	SET estados_idestados = @nuevoidestado
	WHERE idOrden = @idOrden
END;

-- exec updateOrden_idestado 1, 1;


CREATE OR ALTER PROC deleteOrden(
	@idOrden int
)
AS
BEGIN TRANSACTION
	UPDATE OrdenDetalles 
	SET Orden_idOrden = NULL
	WHERE Orden_idOrden = @idOrden
	DELETE FROM  Orden
	WHERE idOrden = @idOrden
	DELETE FROM  OrdenDetalles
	WHERE Orden_idOrden = @idOrden
COMMIT TRANSACTION;

-- exec deleteOrden 1;


-- Crear procedimientos OrdenDetalles


CREATE OR ALTER PROC insertOrden_Detalles(
	@Orden_idOrden int,
	@Prodcutos_idProductos int,
	@cantidad int,
	@precio float,
	@subtotal float
)
AS
BEGIN
	INSERT INTO OrdenDetalles (idOrden, idProductos, cantidad, precio, subtotal)
	VALUES (@Orden_idOrden, @Prodcutos_idProductos, @cantidad, @precio, @subtotal);
END;

-- exec insertOrden_Detalles 1, 1, 5, 3000, 15000;



CREATE OR ALTER PROC updateOrden_Detalles(
    @idOrdenDetalles int,
    @Orden_idOrden int = NULL,
    @Productos_idProductos int = NULL,
    @cantidad int = NULL,
    @precio float = NULL,
    @subtotal float = NULL
)
AS
BEGIN
    UPDATE OrdenDetalles
    SET idOrden = COALESCE(@Orden_idOrden, idOrden),
        idProductos = COALESCE(@Productos_idProductos, idProductos),
        cantidad = COALESCE(@cantidad, cantidad),
        precio = COALESCE(@precio, precio)
    WHERE idOrdenDetalles = @idOrdenDetalles
END;

-- exec updateOrden_Detalles 1, 1, 1, 5, 3000, 15000;



-- exec updateOrdenDetalles_subtotal 1, 30000;

CREATE OR ALTER PROC DeleteOrdenDetalles(
	@idOrdenDetalles int
)
AS
BEGIN TRANSACTION
	DELETE FROM  OrdenDetalles
	WHERE Orden_idOrden = @idOrdenDetalles
COMMIT TRANSACTION;

-- exec deleteOrdenDetalles 3;	


-- Procedimientos de tabla Categoria Productos

CREATE OR ALTER PROC insertCategoria_Prodcutos(
	@usuarios_idusuarios int,
	@nombre varchar(45),
	@fecha_creacion datetime,
	@estados_idestados int
)
AS
BEGIN
	INSERT INTO CategoriaProductos (usuarios_idusuarios, nombre, estados_idestados, fecha_creacion)
	VALUES (@usuarios_idusuarios, @nombre, @estados_idestados, @fecha_creacion);
END;

-- exec insertCategoria_Prodcutos 1, 'Manolo Perez', 1;

drop proc updateCategoria_Prodcutos
CREATE OR ALTER PROC updateCategoria_Productos(
    @idCategoria_Productos int,
    @usuarios_idusuarios int,
    @nombre varchar(45),
    @estados_idestados int,
    @fecha_creacion datetime = NULL
)
AS
BEGIN
    UPDATE CategoriaProductos
    SET usuarios_idusuarios = COALESCE(@usuarios_idusuarios, usuarios_idusuarios),
        nombre = COALESCE(@nombre, nombre),
        estados_idestados = COALESCE(@estados_idestados, estados_idestados),
        fecha_creacion = COALESCE(@fecha_creacion, fecha_creacion)
    WHERE idCategoriaProductos = @idCategoria_Productos
END;

-- exec updateCategoria_Prodcutos 1, 1, 'Manolo Perez', 1, '2024-08-13';

-- ACTIVA O DESACTIVA UN ESTADO

CREATE OR ALTER PROC updateCategoriaProductos_idestados(
	@idCategoriaProductos int,
	@nuevoidestado int
	)
AS
BEGIN
	UPDATE CategoriaProductos
	SET estados_idestados = @nuevoidestado
	WHERE idCategoriaProductos = @idCategoriaProductos
END;

-- exec updateCategoriaProductos_idestados 1, 1;

-- Eliminar Categoria Productos

CREATE OR ALTER PROC DeleteCategoriaProductos(
	@idCategoriaProductos int
)
AS
BEGIN TRANSACTION
	UPDATE Productos
	SET CategoriaProductos_idCategoriaProductos = @idCategoriaProductos
	DELETE FROM  CategoriaProductos
	WHERE idCategoriaProductos = @idCategoriaProductos
	DELETE FROM Productos
	WHERE CategoriaProductos_idCategoriaProductos = @idCategoriaProductos
COMMIT TRANSACTION;

-- exec DeleteCategoriaProductos 3;	


-- Procedimientos para la tabla Rol

CREATE OR ALTER PROC insertNewRol(
	@nombre varchar(45)
	)
AS
BEGIN
	INSERT INTO rol (nombre) VALUES (@nombre);
END;

-- exec insertNewRol 'Este es un nuevo rol';

CREATE OR ALTER PROC updateRol_Nombre(
	@idrol int,
	@nombre varchar(45)
	)
AS
BEGIN
	UPDATE rol
	SET nombre = @nombre
	WHERE idrol = @idrol
END;

-- exec updateRol_Nombre 1, 'Clientess';

-- Eliminar rol
CREATE OR ALTER PROC DeleteRol(
	@idRol int
)
AS
BEGIN TRANSACTION
	DELETE FROM  rol
	WHERE idrol = @idRol
COMMIT TRANSACTION;

-- exec DeleteRol 3;	


-- Procedimientos para la tabla Estados

CREATE OR ALTER PROC insertNewEstado(
	@nombre varchar(45)
	)
AS
BEGIN
	INSERT INTO estados(nombre) VALUES (@nombre);
END;

-- exec insertNewEstado 'Este es un nuevo estado';

CREATE OR ALTER PROC updateEstado_Nombre(
	@idestado int,
	@nombre varchar(45)
	)
AS
BEGIN
	UPDATE estados
	SET nombre = @nombre
	WHERE idestados = @idestado
END;

-- exec updateEstado_Nombre 1, 'inactivos';

-- Eliminar estado

CREATE OR ALTER PROC DeleteEstado(
	@idEstado int
)
AS
BEGIN TRANSACTION
	DELETE FROM  estados
	WHERE @idEstado = @idEstado
COMMIT TRANSACTION;

-- exec DeleteEstado 2;


/*

	5. CREACION DE LAS VISTAS SOLICITADAS

*/

-- Vista no. 1

CREATE OR ALTER VIEW ProductosActivosStock AS
SELECT COUNT(*) AS Productos_Activos_Con_Stock FROM Productos
WHERE estados_idestados=1 AND stock > 0;

SELECT * FROM ProductosActivosStock;

-- Vista no. 2


-- Esta vista muestra null, ya que cada dato se actualiza con getTime()

CREATE OR ALTER VIEW Total_Quetzales_Ordenes_Fecha_Creacion_Agosto_2024 AS
SELECT SUM(total_orden) AS TOTAL_QUETZALES FROM Orden
WHERE MONTH(fecha_creacion) = 8 AND YEAR(fecha_creacion) = 2024;

SELECT * FROM Total_Quetzales_Ordenes_Fecha_Creacion_Agosto_2024;

/*
	Con esta vista se puede hacer la prueba ordenes con fecha de creacion
	del mes de diciembre de 2024
*/

CREATE OR ALTER VIEW Total_Quetzales_Ordenes_Fecha_Creacion_Diciembre_2024 AS
SELECT SUM(total_orden) AS TOTAL_QUETZALES FROM Orden
WHERE MONTH(fecha_creacion) = 12 AND YEAR(fecha_creacion) = 2024;

	SELECT * FROM Total_Quetzales_Ordenes_Fecha_Creacion_Diciembre_2024;


/* 
	Con esta alteracion a la vista utiliza la fecha de entrega en lugar de la fecha creacion
	esta podria usarse como ejemplo 	
*/

CREATE OR ALTER VIEW Total_Quetzales_Ordenes_Fecha_Entrega_Agosto_2024 AS
SELECT SUM(total_orden) AS TOTAL_QUETZALES FROM Orden
WHERE MONTH(fecha_entrega) = 8 AND YEAR(fecha_entrega) = 2024;

SELECT * FROM Total_Quetzales_Ordenes_Fecha_Entrega_Agosto_2024;

-- Vista no. 3


CREATE OR ALTER VIEW TOP_10_CLIENTES_MAYOR_CONSUMO AS
SELECT TOP 10 c.idClientes, c.razon_social, SUM(o.total_orden) AS TOTAL_CONSUMO
FROM Clientes c JOIN Orden o ON c.idClientes = o.Clientes_idClientes
GROUP BY c.idClientes, c.razon_social
ORDER BY TOTAL_CONSUMO DESC;

selecT * from TOP_10_CLIENTES_MAYOR_CONSUMO;

-- Vista no. 4


CREATE OR ALTER VIEW TOP_10_PRODUCTOS_MAS_VENDIDOS AS
SELECT TOP 10 p.idProductos, p.nombre, SUM(od.cantidad) AS TotalVendidos
FROM Productos p
JOIN OrdenDetalles od ON p.idProductos = od.Productos_idProductos
GROUP BY p.idProductos, p.nombre
ORDER BY TotalVendidos ASC;

SELECT * FROM TOP_10_PRODUCTOS_MAS_VENDIDOS;

/* 6. INSERTAR DATOS EN LAS TABLAS UTILIZANDO LOS PROCEDIMIENTOS */

exec insertNewEstado 'Activo';
exec insertNewEstado 'Inactivo';

exec insertNewRol 'Administrado';
exec insertNewRol 'Usuario';
exec insertNewRol 'Cliente';

exec insertClientes 'Tech Solutions', 'Carlos Ramirez', 'Calle 45, Zona 10', '1234-5678', 'carlosramirez@example.com';
exec insertClientes 'Consultoría Global', 'Ana Torres', 'Avenida 12, Centro', '2345-6789', 'anatorres@example.com';
exec insertClientes 'Servicios Integrales', 'Laura Martínez', 'Boulevard 5, Norte', '3456-7890', 'lauramartinez@example.com';
exec insertClientes 'Desarrollo Creativo', 'Juan López', 'Calle 9, Sur', '4567-8901', 'juanlopez@example.com';
exec insertClientes 'Innovación Empresarial', 'Sofia Hernández', 'Avenida 22, Este', '5678-9012', 'sofiahernandez@example.com';
exec insertClientes 'Soluciones Digitales', 'Pedro García', 'Boulevard 13, Oeste', '6789-0123', 'pedrogarcia@example.com';
exec insertClientes 'Marketing Estratégico', 'Lucia Fernández', 'Calle 3, Zona 1', '7890-1234', 'luciafernandez@example.com';
exec insertClientes 'Redes y Telecomunicaciones', 'David Sánchez', 'Avenida 16, Ciudad', '8901-2345', 'davidsanchez@example.com';
exec insertClientes 'Seguridad Informática', 'Patricia Pérez', 'Boulevard 28, Zona 5', '9012-3456', 'patriciaperez@example.com';
exec insertClientes 'Automatización Industrial', 'Jorge González', 'Calle 19, Centro', '0123-4567', 'jorgegonzalez@example.com';
exec insertClientes 'Desarrollo Web', 'Isabel Rodríguez', 'Avenida 32, Norte', '1234-5678', 'isabelrodriguez@example.com';
exec insertClientes 'Consultoría Financiera', 'María López', 'Boulevard 17, Sur', '2345-6789', 'marialopez@example.com';
exec insertClientes 'Tecnología Educativa', 'Fernando Torres', 'Calle 21, Este', '3456-7890', 'fernandotorres@example.com';
exec insertClientes 'Diseño Gráfico', 'Gabriela Ruiz', 'Avenida 24, Oeste', '4567-8901', 'gabrielaruiz@example.com';
exec insertClientes 'Logística Internacional', 'Alejandro Castillo', 'Boulevard 26, Ciudad', '5678-9012', 'alejandrocastillo@example.com';
exec insertClientes 'Consultoría Legal', 'Laura Mendoza', 'Calle 18, Zona 4', '6789-0123', 'lauramendoza@example.com';
exec insertClientes 'Servicios Contables', 'Daniela Morales', 'Avenida 30, Zona 3', '7890-1234', 'danielamorales@example.com';
exec insertClientes 'Proyectos Inmobiliarios', 'Carlos Jiménez', 'Boulevard 20, Norte', '8901-2345', 'carlosjimenez@example.com';
exec insertClientes 'Innovación Agrícola', 'Ana Gómez', 'Calle 12, Sur', '9012-3456', 'anagomez@example.com';
exec insertClientes 'Servicios Médicos', 'Santiago Vargas', 'Avenida 34, Este', '0123-4567', 'santiagovargas@example.com';

exec insertUsuarios 1, 1, 'adminLopez@admin.com', 'Pedro Lopez', 'UnaContrasenia', '4234-4932', '2000-10-10', '2024-08-21', 1;
exec insertUsuarios 1, 1, 'adminJimenez@admin.com', 'Altamiro Jimenez', 'OtraContrasenia', '3434-8122', '2001-12-15', '2024-08-21', 1;
exec insertUsuarios 1, 2, 'adminPerez@admin.com', 'Miguel Perez', 'Contrasenia', '7214-6332', '2002-09-24', '2024-08-21', 2;
exec insertUsuarios 2, 1, 'usuarioRamirez@usuario.com', 'Mario Ramirez', 'UnaContrasenia', '5234-4932', '2000-10-10', '2024-08-21', 1;
exec insertUsuarios 2, 1, 'usuarioMaynez@usuario.com', 'Jose Maynez', 'OtraContrasenia', '3434-8122', '2001-12-15', '2024-08-21', 1;
exec insertUsuarios 2, 2, 'usuarioSenior@usuario.com', 'Miguel Perez', 'Contrasenia', '2254-6332', '2002-09-24', '2024-08-21', 2;
exec insertUsuarios 3, 1, 'clienteReyes@cliente.com', 'Pedro Reyes', 'UnaContrasenia', '6234-4932', '2000-10-10', '2024-08-21', 1;
exec insertUsuarios 3, 1, 'clienteJacinto@cliente.com', 'Jacinto Jimenez', 'OtraContrasenia', '7324-8122', '2024-08-21', '2001-12-15', 1;
exec insertUsuarios 3, 2, 'clientePerez@cliente.com', 'Marino Perez', 'Contrasenia', '5214-6428', '2002-09-24', '2024-08-21', 2;

exec insertCategoria_Prodcutos 1, 'Electrónica', '2024-08-21',  1; 
exec insertCategoria_Prodcutos 2, 'Ropa', '2024-08-21',  2; 
exec insertCategoria_Prodcutos 3, 'Alimentos', '2024-08-21',  1; 
exec insertCategoria_Prodcutos 1, 'Bebidas', '2024-08-21',  2; 
exec insertCategoria_Prodcutos 2, 'Hogar', '2024-08-21',  1; 
exec insertCategoria_Prodcutos 3, 'Juguetes', '2024-08-21',  2; 
exec insertCategoria_Prodcutos 1, 'Deportes', '2024-08-21',  1; 
exec insertCategoria_Prodcutos 2, 'Oficina', '2024-08-21',  2; 
exec insertCategoria_Prodcutos 3, 'Belleza', '2024-08-21',  1; 
exec insertCategoria_Prodcutos 1, 'Salud', '2024-08-21',  2; 
exec insertCategoria_Prodcutos 2, 'Automotriz', '2024-08-21',  1; 
exec insertCategoria_Prodcutos 3, 'Jardinería', '2024-08-21',  2; 
exec insertCategoria_Prodcutos 1, 'Herramientas', '2024-08-21',  1; 
exec insertCategoria_Prodcutos 2, 'Muebles', '2024-08-21',  2; 
exec insertCategoria_Prodcutos 3, 'Tecnología', '2024-08-21',  1; 
exec insertCategoria_Prodcutos 1, 'Mascotas', '2024-08-21',  2; 
exec insertCategoria_Prodcutos 2, 'Libros', '2024-08-21',  1; 
exec insertCategoria_Prodcutos 3, 'Papelería', '2024-08-21',  2;

exec insertProductos 1, 1, 'Laptop', 'Marca X', 'ABC123', 150, 1, 999.99, '2024-08-21', NULL;
exec insertProductos 2, 2, 'Smartphone', 'Marca Y', 'DEF456', 300, 2, 799.99, '2024-08-21', NULL;
exec insertProductos 3, 3, 'TV', 'Marca Z', 'GHI789', 5000, 1, 1500.00, '2024-08-21', NULL;
exec insertProductos 4, 4, 'Tablet', 'Marca A', 'JKL012', 100, 2, 300.00, '2024-08-21', NULL;
exec insertProductos 5, 5, 'Cámara', 'Marca B', 'MNO345', 200, 1, 1200.00, '2024-08-21', NULL;
exec insertProductos 6, 6, 'Impresora', 'Marca C', 'PQR678', 50, 2, 150.00, '2024-08-21', NULL;
exec insertProductos 7, 7, 'Auriculares', 'Marca D', 'STU901', 1000, 1, 50.00, '2024-08-21', NULL;
exec insertProductos 8, 8, 'Monitor', 'Marca E', 'VWX234', 300, 2, 200.00, '2024-08-21', NULL;
exec insertProductos 9, 9, 'Teclado', 'Marca F', 'YZA567', 500, 1, 30.00, '2024-08-21', NULL;
exec insertProductos 10, 1, 'Mouse', 'Marca G', 'BCD890', 1500, 2, 25.00, '2024-08-21', NULL;
exec insertProductos 11, 2, 'Router', 'Marca H', 'EFG123', 60, 1, 80.00,'2024-08-21',  NULL;
exec insertProductos 12, 3, 'Consola de Videojuegos', 'Marca I', 'HIJ456', 2000, 2, 450.00, '2024-08-21', NULL;
exec insertProductos 13, 4, 'Disco Duro Externo', 'Marca J', 'KLM789', 700, 1, 100.00, '2024-08-21', NULL;
exec insertProductos 14, 5, 'Reproductor Blu-ray', 'Marca K', 'NOP012', 40, 2, 150.00, '2024-08-21', NULL;
exec insertProductos 15, 6, 'Bocinas', 'Marca L', 'QRS345', 500, 1, 200.00, '2024-08-21', NULL;
exec insertProductos 16, 7, 'Smartwatch', 'Marca M', 'TUV678', 250, 2, 250.00, '2024-08-21', NULL;
exec insertProductos 17, 8, 'Ventilador', 'Marca N', 'WXY901', 90, 1, 70.00, '2024-08-21', NULL;
exec insertProductos 18, 9, 'Lámpara Inteligente', 'Marca O', 'ZAB234', 300, 2, 60.00, '2024-08-21', NULL;
exec insertProductos 1, 1, 'Batería Portátil', 'Marca P', 'CDE567', 800, 1, 40.00, '2024-08-21', NULL;
exec insertProductos 2, 2, 'Cargador Inalámbrico', 'Marca Q', 'FGH890', 400, 2, 30.00, '2024-08-21', NULL;

