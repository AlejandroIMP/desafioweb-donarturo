# Ejemplos Prácticos del Sistema de Manejo de Errores

Este documento proporciona ejemplos concretos de cómo implementar y utilizar el sistema de manejo de errores en diferentes escenarios dentro de la aplicación.

## Índice

1. [Controlador de Productos](#controlador-de-productos)
2. [Controlador de Autenticación](#controlador-de-autenticación)
3. [Controlador de Órdenes](#controlador-de-órdenes)
4. [Validación de Entrada](#validación-de-entrada)
5. [Errores Personalizados](#errores-personalizados)
6. [Extensión del Sistema](#extensión-del-sistema)

## Controlador de Productos

### Obtener productos con filtros

```typescript
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ResponseHelper } from '../helpers/responseHelper';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../enums/errorMessages';
import Product from '../models/Product';
import Category from '../models/Category';

export const getFilteredProducts = asyncHandler(async (req, res) => {
  const { category_id, min_price, max_price, in_stock } = req.query;
  
  const filters: any = {};
  
  // Aplicar filtros si existen
  if (category_id) {
    // Verificar si la categoría existe
    const category = await Category.findByPk(category_id);
    if (!category) {
      throw new AppError(ERROR_MESSAGES.CATEGORY.NOT_FOUND, 400);
    }
    filters.category_id = category_id;
  }
  
  // Filtro de precio
  if (min_price || max_price) {
    filters.unit_price = {};
    
    if (min_price) {
      if (isNaN(Number(min_price)) || Number(min_price) < 0) {
        throw new AppError('El precio mínimo debe ser un valor numérico positivo', 400);
      }
      filters.unit_price.$gte = Number(min_price);
    }
    
    if (max_price) {
      if (isNaN(Number(max_price)) || Number(max_price) < 0) {
        throw new AppError('El precio máximo debe ser un valor numérico positivo', 400);
      }
      filters.unit_price.$lte = Number(max_price);
    }
  }
  
  // Filtro de stock
  if (in_stock === 'true') {
    filters.stock = { $gt: 0 };
  }
  
  const products = await Product.findAll({
    where: filters,
    include: [{ model: Category, as: 'category' }]
  });
  
  ResponseHelper.success(
    res,
    products,
    SUCCESS_MESSAGES.RETRIEVED,
    200,
    { total: products.length }
  );
});
```

### Crear un producto

```typescript
export const createProduct = asyncHandler(async (req, res) => {
  const { 
    product_name, 
    category_id, 
    unit_price, 
    stock, 
    product_brand 
  } = req.body;
  
  // Validación de campos requeridos
  if (!product_name || !category_id || !unit_price) {
    throw new AppError(
      `${ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS}: nombre, categoría y precio`, 
      400
    );
  }
  
  // Validación de valores
  if (isNaN(Number(unit_price)) || Number(unit_price) <= 0) {
    throw new AppError(ERROR_MESSAGES.PRODUCT.INVALID_PRICE, 400);
  }
  
  if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) {
    throw new AppError(ERROR_MESSAGES.PRODUCT.INVALID_STOCK, 400);
  }
  
  // Verificar si la categoría existe
  const category = await Category.findByPk(category_id);
  if (!category) {
    throw new AppError(ERROR_MESSAGES.CATEGORY.NOT_FOUND, 400);
  }
  
  // Crear el producto
  const product = await Product.create({
    ...req.body,
    unit_price: Number(unit_price),
    stock: stock ? Number(stock) : 0,
    user_id: req.user.id  // Asumiendo que tienes middleware de autenticación
  });
  
  ResponseHelper.created(res, product, SUCCESS_MESSAGES.PRODUCT.CREATED);
});
```

### Actualizar estado de un producto

```typescript
export const updateProductState = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { state_id } = req.body;
  
  if (!id || isNaN(Number(id))) {
    throw new AppError(ERROR_MESSAGES.VALIDATION.INVALID_ID, 400);
  }
  
  if (!state_id) {
    throw new AppError('El ID de estado es requerido', 400);
  }
  
  const product = await Product.findByPk(id);
  
  if (!product) {
    throw new AppError(ERROR_MESSAGES.PRODUCT.NOT_FOUND, 404);
  }
  
  // Verificar si el estado existe
  const state = await State.findByPk(state_id);
  if (!state) {
    throw new AppError('El estado no existe', 400);
  }
  
  await product.update({ state_id });
  
  ResponseHelper.success(
    res, 
    product, 
    SUCCESS_MESSAGES.PRODUCT.STATE_UPDATED
  );
});
```

## Controlador de Autenticación

### Login con manejo de errores

```typescript
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Validar campos requeridos
  if (!email || !password) {
    throw new AppError(
      `${ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS}: email y contraseña`, 
      400
    );
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL, 400);
  }
  
  // Buscar usuario
  const user = await User.findOne({ where: { email } });
  
  // Verificar si el usuario existe
  if (!user) {
    throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
  }
  
  // Verificar si la cuenta está activa
  if (!user.is_active) {
    throw new AppError(ERROR_MESSAGES.AUTH.ACCOUNT_DELETED, 401);
  }
  
  // Verificar si la cuenta está bloqueada
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    throw new AppError(ERROR_MESSAGES.AUTH.ACCOUNT_LOCKED, 401);
  }
  
  // Verificar contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  
  if (!isPasswordValid) {
    // Incrementar contador de intentos fallidos
    user.failed_login_attempts = (user.failed_login_attempts || 0) + 1;
    
    // Si excede el número máximo de intentos, bloquear la cuenta
    if (user.failed_login_attempts >= 5) {
      user.locked_until = new Date(Date.now() + 30 * 60000); // 30 minutos
      await user.save();
      throw new AppError(ERROR_MESSAGES.AUTH.ACCOUNT_LOCKED, 401);
    }
    
    await user.save();
    throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
  }
  
  // Reset de intentos fallidos
  user.failed_login_attempts = 0;
  user.last_login = new Date();
  await user.save();
  
  // Generar token
  const token = generateToken(user);
  
  // Respuesta exitosa
  ResponseHelper.success(res, {
    token,
    user: {
      user_id: user.user_id,
      email: user.email,
      full_name: user.full_name,
      role_id: user.role_id
    }
  }, SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS);
});
```

## Controlador de Órdenes

### Crear una orden con detalles

```typescript
export const createOrder = asyncHandler(async (req, res) => {
  const { 
    client_id,
    delivery_address,
    delivery_date,
    order_details
  } = req.body;
  
  // Validar campos requeridos
  if (!client_id || !delivery_address || !delivery_date || !order_details) {
    throw new AppError(
      `${ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS}: cliente, dirección, fecha de entrega y detalles`, 
      400
    );
  }
  
  // Validar que order_details sea un array no vacío
  if (!Array.isArray(order_details) || order_details.length === 0) {
    throw new AppError(ERROR_MESSAGES.ORDER.EMPTY_DETAILS, 400);
  }
  
  // Validar fecha de entrega
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const deliveryDate = new Date(delivery_date);
  if (isNaN(deliveryDate.getTime()) || deliveryDate < today) {
    throw new AppError(ERROR_MESSAGES.ORDER.INVALID_DELIVERY_DATE, 400);
  }
  
  // Verificar si el cliente existe
  const client = await Client.findByPk(client_id);
  if (!client) {
    throw new AppError(ERROR_MESSAGES.CLIENT.NOT_FOUND, 400);
  }
  
  // Validar los detalles de la orden
  let totalAmount = 0;
  const validatedDetails = [];
  
  for (const detail of order_details) {
    const { product_id, quantity, unit_price } = detail;
    
    if (!product_id || !quantity || quantity <= 0 || !unit_price || unit_price <= 0) {
      throw new AppError('Detalles de orden inválidos', 400);
    }
    
    // Verificar si el producto existe y tiene stock suficiente
    const product = await Product.findByPk(product_id);
    if (!product) {
      throw new AppError(`Producto con ID ${product_id} no encontrado`, 400);
    }
    
    if (product.stock < quantity) {
      throw new AppError(`Stock insuficiente para el producto ${product.product_name}`, 400);
    }
    
    // Calcular subtotal
    const subtotal = quantity * unit_price;
    totalAmount += subtotal;
    
    validatedDetails.push({
      product_id,
      quantity,
      unit_price,
      subtotal
    });
  }
  
  // Crear la orden y sus detalles en una transacción
  const result = await sequelize.transaction(async (t) => {
    // Crear la orden
    const order = await Order.create({
      user_id: req.user.id,
      client_id,
      delivery_address,
      delivery_date,
      total_amount: totalAmount,
      state_id: 1, // Estado inicial (pendiente)
      order_date: new Date(),
    }, { transaction: t });
    
    // Crear los detalles
    for (const detail of validatedDetails) {
      await OrderDetail.create({
        order_id: order.order_id,
        ...detail
      }, { transaction: t });
      
      // Actualizar stock del producto
      await Product.decrement('stock', {
        by: detail.quantity,
        where: { product_id: detail.product_id },
        transaction: t
      });
    }
    
    return order;
  });
  
  // Obtener la orden completa con sus detalles
  const createdOrder = await Order.findByPk(result.order_id, {
    include: [
      { model: OrderDetail, as: 'details' },
      { model: Client, as: 'client' }
    ]
  });
  
  ResponseHelper.created(res, createdOrder, SUCCESS_MESSAGES.ORDER.CREATED);
});
```

## Validación de Entrada

### Función utilitaria para validación

```typescript
// src/helpers/validationHelper.ts
import { AppError } from '../middleware/errorHandler';
import { ERROR_MESSAGES } from '../enums/errorMessages';

export class ValidationHelper {
  /**
   * Valida campos requeridos en un objeto
   */
  static validateRequiredFields(data: any, fields: string[]): void {
    const missingFields = fields.filter(field => 
      data[field] === undefined || data[field] === null || data[field] === ''
    );
    
    if (missingFields.length > 0) {
      throw new AppError(
        `${ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS}: ${missingFields.join(', ')}`,
        400
      );
    }
  }

  /**
   * Valida que un ID sea un número válido
   */
  static validateId(id: any, fieldName: string = 'ID'): number {
    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) {
      throw new AppError(`${fieldName} inválido`, 400);
    }
    return numId;
  }

  /**
   * Valida un número positivo
   */
  static validatePositiveNumber(value: any, fieldName: string): number {
    if (value === undefined || value === null) {
      return 0; // O manejar según la lógica de negocio
    }
    
    const num = Number(value);
    if (isNaN(num)) {
      throw new AppError(`${fieldName} debe ser un número válido`, 400);
    }
    
    if (num < 0) {
      throw new AppError(`${fieldName} debe ser un número positivo`, 400);
    }
    
    return num;
  }

  /**
   * Valida un correo electrónico
   */
  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL, 400);
    }
  }

  /**
   * Valida una fecha
   */
  static validateFutureDate(date: string, fieldName: string = 'Fecha'): Date {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new AppError(`${fieldName} inválida`, 400);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (parsedDate < today) {
      throw new AppError(`${fieldName} debe ser una fecha futura`, 400);
    }
    
    return parsedDate;
  }
}
```

### Uso de ValidationHelper

```typescript
import { asyncHandler } from '../middleware/errorHandler';
import { ResponseHelper } from '../helpers/responseHelper';
import { ValidationHelper } from '../helpers/validationHelper';
import { SUCCESS_MESSAGES } from '../enums/errorMessages';

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { product_name, unit_price, stock, category_id } = req.body;
  
  // Validar ID
  const productId = ValidationHelper.validateId(id, 'ID de producto');
  
  // Validar campos requeridos si están presentes
  if (product_name !== undefined && product_name.trim() === '') {
    throw new AppError('El nombre del producto no puede estar vacío', 400);
  }
  
  // Validar número positivo
  const validatedPrice = unit_price !== undefined ? 
    ValidationHelper.validatePositiveNumber(unit_price, 'Precio') : undefined;
  
  const validatedStock = stock !== undefined ? 
    ValidationHelper.validatePositiveNumber(stock, 'Stock') : undefined;
  
  // Validar categoría si existe
  if (category_id !== undefined) {
    ValidationHelper.validateId(category_id, 'ID de categoría');
    
    const category = await Category.findByPk(category_id);
    if (!category) {
      throw new AppError(ERROR_MESSAGES.CATEGORY.NOT_FOUND, 400);
    }
  }
  
  // Buscar el producto
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new AppError(ERROR_MESSAGES.PRODUCT.NOT_FOUND, 404);
  }
  
  // Actualizar el producto
  await product.update({
    ...(product_name !== undefined && { product_name }),
    ...(validatedPrice !== undefined && { unit_price: validatedPrice }),
    ...(validatedStock !== undefined && { stock: validatedStock }),
    ...(category_id !== undefined && { category_id }),
  });
  
  ResponseHelper.success(res, product, SUCCESS_MESSAGES.PRODUCT.UPDATED);
});
```

## Errores Personalizados

### Definir errores de dominio específicos

```typescript
// src/errors/domainErrors.ts
import { AppError } from '../middleware/errorHandler';

export class ResourceNotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    const message = id 
      ? `${resource} con ID ${id} no encontrado` 
      : `${resource} no encontrado`;
    super(message, 404);
    this.name = 'ResourceNotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'No autorizado para realizar esta acción') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string) {
    super(message, 422); // Unprocessable Entity
    this.name = 'BusinessRuleError';
  }
}
```

### Usando errores de dominio

```typescript
import { asyncHandler } from '../middleware/errorHandler';
import { ResponseHelper } from '../helpers/responseHelper';
import { 
  ResourceNotFoundError, 
  ValidationError, 
  BusinessRuleError 
} from '../errors/domainErrors';

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(Number(id))) {
    throw new ValidationError('ID de producto inválido');
  }
  
  const product = await Product.findByPk(id);
  
  if (!product) {
    throw new ResourceNotFoundError('Producto', id);
  }
  
  // Verificar si hay órdenes relacionadas
  const orderDetails = await OrderDetail.findOne({
    where: { product_id: id }
  });
  
  if (orderDetails) {
    throw new BusinessRuleError(
      'No se puede eliminar el producto porque está asociado a órdenes existentes'
    );
  }
  
  // Soft delete
  await product.update({ is_deleted: true });
  
  ResponseHelper.success(res, null, 'Producto eliminado correctamente');
});
```

## Extensión del Sistema

### Agregar un manejador para errores de terceros

```typescript
// src/helpers/paymentErrorHandler.ts
import { Response } from 'express';
import { ErrorHandler } from '../interfaces/helper.interface';
import { ResponseHelper } from './responseHelper';

// Suponiendo que usamos Stripe como procesador de pagos
export class StripeErrorHandler implements ErrorHandler {
  canHandle(error: any): boolean {
    return error.type && error.type.startsWith('Stripe');
  }
  
  handle(res: Response, error: any): void {
    // Mapear errores de Stripe a respuestas amigables para el usuario
    switch(error.code) {
      case 'card_declined':
        ResponseHelper.badRequest(res, 'La tarjeta fue rechazada, por favor intente con otra');
        break;
      case 'expired_card':
        ResponseHelper.badRequest(res, 'La tarjeta ha expirado');
        break;
      case 'incorrect_cvc':
        ResponseHelper.badRequest(res, 'El código CVC de la tarjeta es incorrecto');
        break;
      case 'processing_error':
        ResponseHelper.internalError(res, 'Error al procesar el pago, por favor intente más tarde');
        break;
      case 'rate_limit':
        ResponseHelper.internalError(res, 'Demasiadas solicitudes, por favor intente más tarde');
        break;
      default:
        ResponseHelper.internalError(res, 'Error en el procesamiento del pago');
    }
  }
}

// Registrar el manejador
import { globalErrorHandler } from '../middleware/errorHandler';

// En app.ts o donde inicialices la aplicación
globalErrorHandler.registerHandler(new StripeErrorHandler());
```

### Crear un middleware personalizado

```typescript
// src/middleware/rateLimiter.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { ERROR_MESSAGES } from '../enums/errorMessages';

// Mapa para almacenar solicitudes por IP
const requestMap = new Map<string, { count: number, resetTime: number }>();

export const rateLimiter = (maxRequests: number = 100, timeWindowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    if (!requestMap.has(ip)) {
      // Primera solicitud desde esta IP
      requestMap.set(ip, {
        count: 1,
        resetTime: now + timeWindowMs
      });
      return next();
    }
    
    const record = requestMap.get(ip)!;
    
    // Reiniciar contador si ha pasado el tiempo
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + timeWindowMs;
      return next();
    }
    
    // Verificar límite de solicitudes
    if (record.count >= maxRequests) {
      throw new AppError(
        'Demasiadas solicitudes, por favor intente más tarde',
        429
      );
    }
    
    // Incrementar contador
    record.count++;
    return next();
  };
};

// Uso en app.ts
app.use(rateLimiter(100, 60000)); // 100 solicitudes por minuto
```

Estos ejemplos cubren una amplia variedad de casos de uso comunes en aplicaciones web modernas, demostrando cómo el sistema de manejo de errores puede adaptarse a diferentes necesidades y escenarios.
