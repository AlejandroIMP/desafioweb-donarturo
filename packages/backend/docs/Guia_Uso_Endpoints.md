# Guía de Uso de Endpoints - Backend API

Esta guía proporciona información detallada sobre cómo utilizar todos los endpoints disponibles en el backend de la aplicación. Incluye ejemplos para POSTMAN, cURL y JavaScript/TypeScript.

## Configuración Base

**URL Base**: `http://localhost:5000` (ajustar según el puerto configurado)

### Headers Requeridos

Para endpoints protegidos, incluir:
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

### Roles de Usuario
- **ADMIN** (role_id: 1): Acceso completo
- **USER** (role_id: 2): Acceso limitado
- **CLIENTE** (role_id: 3): Acceso básico

---

## 1. AUTENTICACIÓN

### 1.1 Registro de Usuario

**Endpoint**: `POST /auth/register`  
**Autenticación**: No requerida

#### Body (JSON):
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "full_name": "Nombre Completo",
  "role_id": 2,
  "state_id": 1,
  "phone": "1234567890",
  "birth_date": "1990-01-01"
}
```

#### Ejemplo POSTMAN:
```
Method: POST
URL: http://localhost:3000/auth/register
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "email": "test@ejemplo.com",
  "password": "password123",
  "full_name": "Usuario de Prueba",
  "role_id": 2,
  "state_id": 1
}
```

#### Ejemplo cURL:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "password123",
    "full_name": "Usuario de Prueba",
    "role_id": 2,
    "state_id": 1
  }'
```

#### Ejemplo JavaScript (Frontend):
```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// Uso
const newUser = {
  email: "test@ejemplo.com",
  password: "password123",
  full_name: "Usuario de Prueba",
  role_id: 2,
  state_id: 1
};

registerUser(newUser);
```

### 1.2 Inicio de Sesión

**Endpoint**: `POST /auth/login`  
**Autenticación**: No requerida

#### Body (JSON):
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

#### Respuesta Exitosa:
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "email": "usuario@ejemplo.com",
      "full_name": "Nombre Completo",
      "role_id": 2
    }
  }
}
```

#### Ejemplo JavaScript (Frontend):
```javascript
const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Guardar token en localStorage
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }
    
    return result;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};
```

---

## 2. PRODUCTOS

### 2.1 Obtener Todos los Productos

**Endpoint**: `GET /productos`  
**Autenticación**: Requerida  
**Roles**: ADMIN, USER, CLIENTE

#### Ejemplo POSTMAN:
```
Method: GET
URL: http://localhost:3000/productos
Headers:
  Authorization: Bearer <token>
```

#### Ejemplo cURL:
```bash
curl -X GET http://localhost:3000/productos \
  -H "Authorization: Bearer <token>"
```

#### Ejemplo JavaScript:
```javascript
const getProducts = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:3000/productos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    throw error;
  }
};
```

### 2.2 Obtener Producto por ID

**Endpoint**: `GET /productos/:id`  
**Autenticación**: Requerida  
**Roles**: ADMIN, USER, CLIENTE

#### Ejemplo JavaScript:
```javascript
const getProductById = async (id) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`http://localhost:3000/productos/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    throw error;
  }
};
```

### 2.3 Crear Producto

**Endpoint**: `POST /productos`  
**Autenticación**: Requerida  
**Roles**: ADMIN

#### Body (JSON):
```json
{
  "user_id": 1,
  "category_id": 1,
  "state_id": 1,
  "product_name": "Producto de Prueba",
  "product_brand": "Marca",
  "product_code": "PRD001",
  "stock": 100,
  "unit_price": 25.99,
  "product_photo": "https://ejemplo.com/imagen.jpg"
}
```

#### Ejemplo JavaScript:
```javascript
const createProduct = async (productData) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:3000/productos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creando producto:', error);
    throw error;
  }
};
```

### 2.4 Crear Producto con Imagen

**Endpoint**: `POST /productos/with-image`  
**Autenticación**: Requerida  
**Roles**: ADMIN

#### Ejemplo con FormData (JavaScript):
```javascript
const createProductWithImage = async (productData, imageFile) => {
  const token = localStorage.getItem('token');
  
  const formData = new FormData();
  
  // Agregar datos del producto
  Object.keys(productData).forEach(key => {
    formData.append(key, productData[key]);
  });
  
  // Agregar imagen
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  try {
    const response = await fetch('http://localhost:3000/productos/with-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // No incluir Content-Type para FormData
      },
      body: formData
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creando producto con imagen:', error);
    throw error;
  }
};
```

### 2.5 Actualizar Producto

**Endpoint**: `PUT /productos/:id`  
**Autenticación**: Requerida  
**Roles**: ADMIN

#### Ejemplo JavaScript:
```javascript
const updateProduct = async (id, productData) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`http://localhost:3000/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error actualizando producto:', error);
    throw error;
  }
};
```

### 2.6 Actualizar Estado del Producto

**Endpoint**: `PATCH /productos/:id`  
**Autenticación**: Requerida  
**Roles**: ADMIN

#### Body (JSON):
```json
{
  "state_id": 2
}
```

#### Ejemplo JavaScript:
```javascript
const updateProductState = async (id, stateId) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`http://localhost:3000/productos/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ state_id: stateId })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error actualizando estado del producto:', error);
    throw error;
  }
};
```

---

## 3. CATEGORÍAS DE PRODUCTOS

### 3.1 Obtener Todas las Categorías

**Endpoint**: `GET /productCategory`  
**Autenticación**: Requerida  
**Roles**: ADMIN, USER, CLIENTE

#### Ejemplo JavaScript:
```javascript
const getCategories = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:3000/productCategory', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    throw error;
  }
};
```

### 3.2 Crear Categoría

**Endpoint**: `POST /productCategory`  
**Autenticación**: Requerida  
**Roles**: ADMIN

#### Body (JSON):
```json
{
  "user_id": 1,
  "state_id": 1,
  "category_name": "Nueva Categoría",
  "category_description": "Descripción de la categoría"
}
```

---

## 4. USUARIOS

### 4.1 Obtener Todos los Usuarios

**Endpoint**: `GET /usuarios`  
**Autenticación**: Requerida  
**Roles**: ADMIN

#### Ejemplo JavaScript:
```javascript
const getUsers = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:3000/usuarios', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};
```

### 4.2 Crear Usuario

**Endpoint**: `POST /usuarios`  
**Autenticación**: Requerida  
**Roles**: ADMIN

#### Body (JSON):
```json
{
  "email": "nuevo@usuario.com",
  "password": "password123",
  "full_name": "Nuevo Usuario",
  "role_id": 2,
  "state_id": 1,
  "phone": "1234567890"
}
```

---

## 5. CLIENTES

### 5.1 Obtener Todos los Clientes

**Endpoint**: `GET /client`  
**Autenticación**: Requerida  
**Roles**: ADMIN

#### Ejemplo JavaScript:
```javascript
const getClients = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:3000/client', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    throw error;
  }
};
```

### 5.2 Crear Cliente

**Endpoint**: `POST /client`  
**Autenticación**: Requerida  
**Roles**: ADMIN

#### Body (JSON):
```json
{
  "business_name": "Empresa S.A.",
  "commercial_name": "Empresa Comercial",
  "delivery_address": "Calle 123, Ciudad",
  "phone": "1234567890",
  "email": "contacto@empresa.com",
  "tax_id": "123456789"
}
```

---

## 6. ÓRDENES

### 6.1 Obtener Todas las Órdenes

**Endpoint**: `GET /order`  
**Autenticación**: Requerida  
**Roles**: ADMIN, USER, CLIENTE

### 6.2 Crear Orden

**Endpoint**: `POST /order`  
**Autenticación**: Requerida  
**Roles**: ADMIN, USER, CLIENTE

#### Body (JSON):
```json
{
  "user_id": 1,
  "state_id": 1,
  "order_date": "2024-01-01",
  "total_amount": 100.50,
  "client_id": 1,
  "delivery_address": "Dirección de entrega",
  "phone": "1234567890",
  "email": "cliente@email.com",
  "delivery_date": "2024-01-05",
  "order_details": [
    {
      "product_id": 1,
      "quantity": 2,
      "unit_price": 25.99
    },
    {
      "product_id": 2,
      "quantity": 1,
      "unit_price": 48.52
    }
  ]
}
```

#### Ejemplo JavaScript:
```javascript
const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:3000/order', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creando orden:', error);
    throw error;
  }
};
```

### 6.3 Obtener Órdenes por Usuario

**Endpoint**: `GET /order/user/:id`  
**Autenticación**: Requerida  
**Roles**: ADMIN, USER, CLIENTE

#### Ejemplo JavaScript:
```javascript
const getOrdersByUser = async (userId) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`http://localhost:3000/order/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo órdenes del usuario:', error);
    throw error;
  }
};
```

### 6.4 Actualizar Estado de Orden

**Endpoint**: `PATCH /order/:id`  
**Autenticación**: Requerida  
**Roles**: ADMIN, USER, CLIENTE

#### Body (JSON):
```json
{
  "state_id": 2
}
```

---

## 7. ESTADOS

### 7.1 Obtener Todos los Estados

**Endpoint**: `GET /estados`  
**Autenticación**: Requerida  
**Roles**: ADMIN

#### Ejemplo JavaScript:
```javascript
const getStates = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:3000/estados', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo estados:', error);
    throw error;
  }
};
```

---

## Manejo de Errores

### Códigos de Estado HTTP Comunes:

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Error en la solicitud (datos inválidos)
- **401**: No autorizado (token inválido o faltante)
- **403**: Prohibido (rol insuficiente)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

### Formato de Respuesta de Error:
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos del error"
}
```

### Ejemplo de Manejo de Errores en JavaScript:
```javascript
const handleApiCall = async (apiFunction, ...args) => {
  try {
    const result = await apiFunction(...args);
    
    if (!result.success) {
      throw new Error(result.message || 'Error en la operación');
    }
    
    return result;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expirado - redirigir a login
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Sin permisos
      alert('No tienes permisos para realizar esta acción');
    } else {
      // Otros errores
      console.error('Error:', error.message);
      alert(error.message || 'Error en la operación');
    }
    throw error;
  }
};
```

---

## Utilidades para Frontend

### Función Helper para Headers:
```javascript
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
```

### Función Helper para API Calls:
```javascript
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  
  const config = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`http://localhost:3000${endpoint}`, config);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Error en la solicitud');
    }
    
    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Uso
const products = await apiCall('/productos');
const newProduct = await apiCall('/productos', 'POST', productData);
```

---

## Notas Importantes

1. **Tokens JWT**: Los tokens tienen un tiempo de expiración. Implementar renovación automática o redirección al login cuando expiren.

2. **CORS**: Asegurar que el backend tenga configurado CORS para permitir solicitudes desde el frontend.

3. **Validación**: Todos los endpoints validan los datos de entrada. Revisar los mensajes de error para corregir datos inválidos.

4. **Archivos**: Para subir archivos, usar `FormData` y no establecer `Content-Type` manualmente.

5. **Roles**: Verificar que el usuario tenga el rol adecuado antes de hacer solicitudes a endpoints protegidos.

---

Esta guía cubre todos los endpoints disponibles en el backend. Para casos específicos o nuevas funcionalidades, consultar la documentación del código fuente en los controladores correspondientes.