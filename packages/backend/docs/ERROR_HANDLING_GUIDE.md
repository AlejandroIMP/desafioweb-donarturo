# Guía de Uso del Sistema de Manejo de Errores

Este documento explica cómo utilizar el sistema de manejo de errores implementado en el backend de la aplicación. El sistema está diseñado siguiendo los principios SOLID, con un enfoque en la extensibilidad, mantenibilidad y consistencia de las respuestas de error.

## Índice

1. [Visión General](#visión-general)
2. [Componentes Principales](#componentes-principales)
3. [Ejemplos de Uso](#ejemplos-de-uso)
4. [Extensión del Sistema](#extensión-del-sistema)
5. [Mensajes de Error Predefinidos](#mensajes-de-error-predefinidos)
6. [Manejo de Errores en Controladores](#manejo-de-errores-en-controladores)
7. [Integración con Frontend](#integración-con-frontend)
8. [Mejores Prácticas](#mejores-prácticas)

## Visión General

El sistema de manejo de errores está compuesto por varios módulos interconectados que colaboran para proporcionar una experiencia coherente tanto para los desarrolladores como para los usuarios finales. Este sistema:

- Captura y gestiona errores de diferentes orígenes (HTTP, base de datos, validación, etc.)
- Proporciona respuestas de error consistentes y bien formateadas
- Permite la extensibilidad mediante el patrón de estrategia
- Centraliza los mensajes de error para mantener consistencia
- Registra detalles de los errores para facilitar la depuración

## Componentes Principales

### ResponseHelper

Clase utilitaria para generar respuestas HTTP consistentes:

```typescript
// Ejemplos de uso
ResponseHelper.success(res, data, "Operación exitosa");
ResponseHelper.created(res, newEntity);
ResponseHelper.badRequest(res, "Parámetros inválidos", ["El campo X es requerido"]);
ResponseHelper.notFound(res, "Recurso no encontrado");
ResponseHelper.internalError(res, "Error interno del servidor");
```

### ErrorHandler

Middleware para capturar y procesar errores en la aplicación:

```typescript
// En app.ts o index.ts
app.use(errorHandler);
app.use(notFoundHandler);

// En controladores, usar asyncHandler
export const getUser = asyncHandler(async (req, res) => {
  // Tu código aquí - no necesitas try/catch
});
```

### AppError

Clase para crear errores personalizados con información adicional:

```typescript
throw new AppError("Mensaje de error personalizado", 400);
throw new AppError("Recurso no encontrado", 404);
```

### ErrorMessages

Enumeración centralizada de mensajes de error:

```typescript
import { ERROR_MESSAGES } from '../enums/errorMessages';

throw new AppError(ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS);
```

## Ejemplos de Uso

### 1. Manejo Básico de Errores

```typescript
import { asyncHandler } from '../middleware/errorHandler';
import { ResponseHelper } from '../helpers/responseHelper';

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return ResponseHelper.badRequest(res, "ID de producto no proporcionado");
  }
  
  const product = await Product.findByPk(id);
  
  if (!product) {
    return ResponseHelper.notFound(res, "Producto no encontrado");
  }
  
  return ResponseHelper.success(res, product);
});
```

### 2. Usando AppError para Errores Personalizados

```typescript
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ERROR_MESSAGES } from '../enums/errorMessages';

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, stock } = req.body;
  
  if (!name || !price) {
    throw new AppError(ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS, 400);
  }
  
  if (price <= 0) {
    throw new AppError(ERROR_MESSAGES.PRODUCT.INVALID_PRICE, 400);
  }
  
  if (stock < 0) {
    throw new AppError(ERROR_MESSAGES.PRODUCT.INVALID_STOCK, 400);
  }
  
  const product = await Product.create(req.body);
  ResponseHelper.created(res, product);
});
```

### 3. Manejo de Errores de Sequelize

```typescript
// No necesitas hacer nada especial, el sistema captura automáticamente los errores de Sequelize
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.update(req.body, {
    where: { id: req.params.id }
  });
  
  ResponseHelper.success(res, user);
});

// Si hay un error de validación o restricción en Sequelize, será manejado automáticamente
```

## Extensión del Sistema

### 1. Agregar un Nuevo Manejador de Errores

```typescript
import { ErrorHandler } from '../interfaces/helper.interface';
import { Response } from 'express';
import { ResponseBuilder } from '../helpers/responseBuilder';

// 1. Crear una clase que implemente ErrorHandler
class CustomApiErrorHandler implements ErrorHandler {
  canHandle(error: any): boolean {
    return error.name === 'CustomApiError';
  }
  
  handle(res: Response, error: any): void {
    ResponseBuilder.sendError(res, error.status || 500, error.message);
  }
}

// 2. Registrar el manejador
import { globalErrorHandler } from '../middleware/errorHandler';

// En app.ts o donde inicialices tu aplicación
globalErrorHandler.registerHandler(new CustomApiErrorHandler());
```

### 2. Agregar una Nueva Estrategia para Errores de Sequelize

```typescript
import { SequelizeErrorStrategy } from '../helpers/sequelizeErrorHandler';
import { Response } from 'express';
import { ResponseBuilder } from '../helpers/responseBuilder';

// 1. Crear una nueva estrategia
class DeadlockErrorStrategy implements SequelizeErrorStrategy {
  canHandle(error: any): boolean {
    return error.name === 'SequelizeTimeoutError' && error.message.includes('deadlock');
  }
  
  handle(res: Response, error: any): void {
    ResponseBuilder.sendError(res, 409, 'Conflicto de concurrencia, intente nuevamente');
  }
}

// 2. Registrar la estrategia
import { SequelizeErrorHandler } from '../helpers/sequelizeErrorHandler';

// En app.ts o donde inicialices tu aplicación
const sequelizeHandler = new SequelizeErrorHandler();
sequelizeHandler.registerStrategy(new DeadlockErrorStrategy());

// Si estás usando ResponseHelper
import { ResponseHelper } from '../helpers/responseHelper';
ResponseHelper.setSequelizeErrorHandler(sequelizeHandler);
```

## Mensajes de Error Predefinidos

El archivo `errorMessages.ts` contiene mensajes de error predefinidos organizados por categorías:

```typescript
// Ejemplos
ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS     // "Credenciales inválidas"
ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS   // "Faltan campos requeridos"
ERROR_MESSAGES.PRODUCT.NOT_FOUND            // "Producto no encontrado"
ERROR_MESSAGES.SYSTEM.DATABASE_ERROR        // "Error en la base de datos"
```

Para usar estos mensajes:

```typescript
import { ERROR_MESSAGES } from '../enums/errorMessages';

throw new AppError(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL, 400);
ResponseHelper.badRequest(res, ERROR_MESSAGES.AUTH.TOKEN_REQUIRED);
```

Para agregar nuevos mensajes, extienda el objeto `ERROR_MESSAGES`:

```typescript
// errorMessages.ts
export const ERROR_MESSAGES = {
  // Categorías existentes...
  
  // Nueva categoría
  PAYMENT: {
    PAYMENT_FAILED: 'El pago ha fallado',
    INVALID_CARD: 'La tarjeta no es válida',
    INSUFFICIENT_FUNDS: 'Fondos insuficientes'
  }
};
```

## Manejo de Errores en Controladores

### Enfoque recomendado (con asyncHandler)

```typescript
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ERROR_MESSAGES } from '../enums/errorMessages';

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(Number(id))) {
    throw new AppError(ERROR_MESSAGES.VALIDATION.INVALID_ID, 400);
  }
  
  const order = await Order.findByPk(id);
  
  if (!order) {
    throw new AppError(ERROR_MESSAGES.ORDER.NOT_FOUND, 404);
  }
  
  ResponseHelper.success(res, order);
});
```

### Manejo manual (evitar si es posible)

```typescript
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return ResponseHelper.badRequest(res, ERROR_MESSAGES.VALIDATION.INVALID_ID);
    }
    
    const order = await Order.findByPk(id);
    
    if (!order) {
      return ResponseHelper.notFound(res, ERROR_MESSAGES.ORDER.NOT_FOUND);
    }
    
    ResponseHelper.success(res, order);
  } catch (error) {
    next(error); // Pasar al middleware de manejo de errores
  }
};
```

## Integración con Frontend

El sistema devuelve respuestas de error con un formato consistente:

```json
{
  "success": false,
  "message": "Mensaje de error comprensible para el usuario",
  "errors": ["Detalles específicos de los errores (opcional)"],
  "meta": {
    "timestamp": "2023-06-08T12:34:56.789Z"
  }
}
```

### Ejemplo de manejo en el Frontend (React con fetch)

```javascript
const fetchData = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!data.success) {
      // Mostrar mensaje de error al usuario
      showToast('error', data.message);
      
      // Si hay errores específicos, mostrarlos
      if (data.errors && data.errors.length) {
        console.error('Detalles del error:', data.errors);
      }
      
      return null;
    }
    
    return data.data; // Devolver solo los datos
  } catch (error) {
    showToast('error', 'Error de red o del servidor');
    console.error('Error:', error);
    return null;
  }
};
```

### Ejemplo con Axios

```javascript
import axios from 'axios';

// Configurar interceptor para manejar errores de forma global
axios.interceptors.response.use(
  (response) => {
    // Para respuestas exitosas, devolver directamente data
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado de error
      const { data } = error.response;
      
      if (data && !data.success) {
        // Mostrar mensaje de error
        showToast('error', data.message);
        
        // Si es un error de autenticación (401), redirigir al login
        if (error.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      showToast('error', 'No se recibió respuesta del servidor');
    } else {
      // Ocurrió un error al configurar la solicitud
      showToast('error', 'Error al realizar la solicitud');
    }
    
    return Promise.reject(error);
  }
);
```

## Mejores Prácticas

1. **Usar asyncHandler**: Envuelve todos los controladores asíncronos con el `asyncHandler` para capturar automáticamente las excepciones.

2. **Usar AppError**: Para errores personalizados, lanza una instancia de `AppError` en lugar de un Error estándar.

3. **Usar mensajes predefinidos**: Utiliza `ERROR_MESSAGES` para mantener consistencia en los mensajes de error.

4. **Validación temprana**: Valida los datos de entrada lo antes posible y devuelve errores específicos.

5. **No exponer detalles técnicos**: En producción, no envíes detalles técnicos del error al cliente.

6. **Logging adecuado**: Asegúrate de que los errores críticos queden registrados para diagnóstico.

7. **Errores específicos**: Devuelve códigos de estado HTTP adecuados y mensajes claros que ayuden al usuario.

8. **Extender, no modificar**: Para agregar nuevos manejadores de errores, extiende el sistema utilizando sus mecanismos de registro, no modificando el código existente.

## Conclusión

Este sistema de manejo de errores proporciona una base sólida para la gestión uniforme de errores en toda la aplicación. Al seguir las convenciones y patrones establecidos, aseguras que los usuarios reciban mensajes de error coherentes y útiles, mientras el equipo de desarrollo dispone de la información necesaria para diagnosticar y corregir problemas.

La arquitectura orientada a la extensión permite agregar fácilmente soporte para nuevos tipos de errores sin modificar el código existente, siguiendo el principio Abierto/Cerrado (OCP) de SOLID.
