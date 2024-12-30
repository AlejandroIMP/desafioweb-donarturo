
# E-Commerce API

This is the API for the e-commerce. Includes all necesary CRUD's



## API Reference


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `JWT Token` | `string` | **Required**. Your Token |

### LOGIN & REGISTER

#### Registrar un usuario

```http
  POST /api/auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `rol_idrol` | `int` | **Required**. Your rol in the system |
| `estados_idestados` | `int` | **Required**. Your state in the system |
| `correo_electronico` | `string` | **Required**. Your email |
| `nombre_completo` | `string` | **Required**. Your complete name |
| `user_password` | `int` | **Required**. Your password |
| `telefono` | `int` |  Your phone number |
| `fecha_nacimiento` | `string` |  Date |
| `Clientes_idClientes` | `string` |  Clients if exist |


#### Login de un usuario registrado
```http
  POST /api/auth/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `correo_electronico` | `string` | **Required**. Your email |
| `user_password` | `int` | **Required**. Your password |

### PRODUCTOS

#### Obtener todos los productos

```http
  GET /api/productos
```

#### Obtener un producto

```http
  GET /api/productos/${id}
```

#### Insertar un producto 

```http
  POST /api/productos
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `CategoriaProductos_idCategoriaProductos` | `int` | **Required**. Category |
| `usuarios_idusuarios` | `int` | **Required**. User who register the product |
| `nombre` | `string` | **Required**. Name of product |
| `marca` | `string` | **Required**. |
| `codigo` | `int` | **Required**. code of product |
| `stock` | `int` |  quantity of stock of product |
| `estados_idestados` | `string` |  state of the product |
| `precio` | `decimal` |  price of the product |
| `foto` | `string` |  URL of the image of the product |

#### Actualizar un producto 

```http
  PUT /api/productos/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `CategoriaProductos_idCategoriaProductos` | `int` | **Required**. Category |
| `usuarios_idusuarios` | `int` | **Required**. User who register the product |
| `nombre` | `string` | **Required**. Name of product |
| `marca` | `string` | **Required**. |
| `codigo` | `int` | **Required**. code of product |
| `stock` | `int` |  quantity of stock of product |
| `estados_idestados` | `string` |  state of the product |
| `precio` | `decimal` |  price of the product |
| `foto` | `string` |  URL of the image of the product |

#### Actualizar estado ACTIVO/INACTIVO de un producto

```http
  PATCH /api/productos/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `estados_idestados` | `int` | **Required**. 1 for Active | 2 for Inactive |

### CLIENTES

#### Obtener todos los clientes

```http
  GET /api/clientes
```

#### Obtener un cliente

```http
  GET /api/clientes/${id}
```

#### Insertar un cliente 

```http
  POST /api/clientes
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `razon_s` | `string` | **Required**. Razon social |
| `nombre_comercial` | `string` | **Required**. Nombre comercial |
| `direccion` | `string` | **Required**. Direccion del cliente |
| `telefono` | `string` | **Required**. Telefono del cliente |
| `email` | `string` | **Required**. correo del cliente |


#### Actualizar un cliente 

```http
  PUT /api/clientes/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `razon_s` | `string` | **Required**. Razon social |
| `nombre_comercial` | `string` | **Required**. Nombre comercial |
| `direccion` | `string` | **Required**. Direccion del cliente |
| `telefono` | `string` | **Required**. Telefono del cliente |
| `email` | `string` | **Required**. correo del cliente |


### ORDEN Y DETALLES

#### Obtener todos las Ordenes

```http
  GET /api/order
```

#### Obtener una orden

```http
  GET /api/order/${id}
```

#### Insertar una orden con sus detalles 

```http
  POST /api/order
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `estados_idestados` | `int` | **Required**. state of the order |
| `nombre_completo` | `string` | **Required**. full name |
| `direccion` | `string` | **Required**. Full address |
| `telefono` | `string` | **Required**. phone number |
| `correo_electronico` | `string` | **Required**. email |
| `fecha_entrega` | `date` | **Required**. Date |
| `Clientes_idClientes` | `int` | **Required**. Client id |
| `DetallesProductos` | `string` | **Required**. Json with Details |

#### JSON details

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `idProductos` | `int` | **Required**. id of the product |
| `cantidad` | `int` | **Required**. quantity of the product |
| `precio` | `decimal` | **Required**. price of the product |

#### Actualizar una orden 

```http
  PUT /api/order/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `estados_idestados` | `int` | **Required**. state of the order |
| `nombre_completo` | `string` | **Required**. full name |
| `direccion` | `string` | **Required**. Full address |
| `telefono` | `string` | **Required**. phone number |
| `correo_electronico` | `string` | **Required**. email |
| `fecha_entrega` | `date` | **Required**. Date |
| `Clientes_idClientes` | `int` | **Required**. Client id |

#### Actualizar estado ACTIVO/INACTIVO de una orden

```http
  PATCH /api/order/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `estados_idestados` | `int` | **Required**. 1 for Active | 2 for Inactive |

### CATEGORIAS

#### Obtener todos las Categorias

```http
  GET /api/productCategory
```

#### Obtener una categoria

```http
  GET /api/productCategory/${id}
```

#### Insertar una categoria

```http
  POST /api/productCategory
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `usuarios_idusuarios` | `int` | **Required**. User creating the category |
| `nombre` | `string` | **Required**. full name |
| `estados_idestados` | `string` | **Required**. state of the category |

#### Actualizar una categoria 

```http
  PUT /api/productCategory/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `usuarios_idusuarios` | `int` | **Required**. User creating the category |
| `nombre` | `string` | **Required**. full name |
| `estados_idestados` | `string` | **Required**. state of the category |


#### Actualizar estado ACTIVO/INACTIVO de una categoria

```http
  PATCH /api/productCategory/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `estados_idestados` | `int` | **Required**. 1 for Active | 2 for Inactive |

### ESTADOS

#### Obtener todos los estados

```http
  GET /api/estados
```

#### Obtener un estado

```http
  GET /api/estados/${id}
```

#### Insertar un estado 

```http
  POST /api/estados
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `nombre` | `int` | **Required**. name of the state |

#### Actualizar un estado 

```http
  PUT /api/estados/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `nombre` | `int` | **Required**. name of the state |

### USUARIOS

#### Obtener todos los usuarios

```http
  GET /api/usuarios
```

#### Obtener un usuario

```http
  GET /api/usuarios/${id}
```

#### Actualizar un usuario

```http
  PUT /api/usuarios/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `rol_idrol` | `int` | **Required**. Your rol in the system |
| `estados_idestados` | `int` | **Required**. Your state in the system |
| `correo_electronico` | `string` | **Required**. Your email |
| `nombre_completo` | `string` | **Required**. Your complete name |
| `user_password` | `int` | **Required**. Your password |
| `telefono` | `int` |  Your phone number |
| `fecha_nacimiento` | `string` |  Date |
| `Clientes_idClientes` | `string` |  Clients if exist |

#### Actualizar estado ACTIVO/INACTIVO de un usuario

```http
  PATCH /api/usuarios/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `estados_idestados` | `int` | **Required**. 1 for Active | 2 for Inactive |