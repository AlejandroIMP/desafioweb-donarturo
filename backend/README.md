
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
| `rolId` | `int` | **Required**. Your rol in the system |
| `estadoId` | `int` | **Required**. Your state in the system |
| `email` | `string` | **Required**. Your email |
| `nombre` | `string` | **Required**. Your complete name |
| `user_pass` | `int` | **Required**. Your password |
| `telefono` | `int` |  Your phone number |
| `fecha` | `string` |  Date |
| `clientesId` | `string` |  Clients if exist |


#### Login de un usuario registrado
```http
  POST /api/auth/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Your email |
| `user_pass` | `int` | **Required**. Your password |

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
#### Actualizar un producto 

```http
  PUT /api/productos/${id}
```

#### Actualizar estado ACTIVO/INACTIVO de un producto

```http
  PATCH /api/productos/${id}
```

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
#### Actualizar un cliente 

```http
  PUT /api/clientes/${id}
```

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
#### Actualizar una orden 

```http
  PUT /api/order/${id}
```
#### Actualizar estado ACTIVO/INACTIVO de una orden

```http
  PATCH /api/order/${id}
```

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
#### Actualizar una categoria 

```http
  PUT /api/productCategory/${id}
```
#### Actualizar estado ACTIVO/INACTIVO de una categoria

```http
  PATCH /api/productCategory/${id}
```

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
#### Actualizar un estado 

```http
  PUT /api/estados/${id}
```

