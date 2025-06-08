export const ERROR_MESSAGES = {
  // Autenticación
  AUTH: {
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    ACCOUNT_LOCKED: 'Cuenta bloqueada temporalmente por múltiples intentos fallidos',
    ACCOUNT_DELETED: 'Esta cuenta ha sido eliminada',
    TOKEN_REQUIRED: 'Token de autenticación requerido',
    TOKEN_INVALID: 'Token de autenticación inválido',
    TOKEN_EXPIRED: 'Token de autenticación expirado',
    INSUFFICIENT_PERMISSIONS: 'No tienes permisos suficientes para esta acción'
  },

  // Validación
  VALIDATION: {
    REQUIRED_FIELDS: 'Faltan campos requeridos',
    INVALID_EMAIL: 'Formato de email inválido',
    INVALID_PHONE: 'Formato de teléfono inválido',
    PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres',
    INVALID_DATE: 'Formato de fecha inválido',
    INVALID_ID: 'ID inválido'
  },

  // Recursos
  RESOURCE: {
    NOT_FOUND: 'Recurso no encontrado',
    ALREADY_EXISTS: 'El recurso ya existe',
    CANNOT_DELETE: 'No se puede eliminar este recurso',
    CREATION_FAILED: 'Error al crear el recurso',
    UPDATE_FAILED: 'Error al actualizar el recurso',
    DELETE_FAILED: 'Error al eliminar el recurso'
  },

  // Productos
  PRODUCT: {
    NOT_FOUND: 'Producto no encontrado',
    CODE_EXISTS: 'El código de producto ya existe',
    INVALID_PRICE: 'El precio debe ser mayor que cero',
    INVALID_STOCK: 'La cantidad en stock debe ser mayor o igual a cero',
    IMAGE_UPLOAD_FAILED: 'Error al subir la imagen del producto'
  },

  // Usuarios
  USER: {
    NOT_FOUND: 'Usuario no encontrado',
    EMAIL_EXISTS: 'El correo electrónico ya está registrado',
    CREATION_FAILED: 'Error al crear el usuario',
    UPDATE_FAILED: 'Error al actualizar el usuario'
  },

  // Órdenes
  ORDER: {
    NOT_FOUND: 'Orden no encontrada',
    INVALID_STATE: 'Estado de orden inválido',
    EMPTY_DETAILS: 'La orden debe tener al menos un producto',
    INVALID_DELIVERY_DATE: 'La fecha de entrega debe ser posterior a hoy'
  },

  // Clientes
  CLIENT: {
    NOT_FOUND: 'Cliente no encontrado',
    EMAIL_EXISTS: 'El email del cliente ya está registrado'
  },

  // Categorías
  CATEGORY: {
    NOT_FOUND: 'Categoría no encontrada',
    NAME_EXISTS: 'Ya existe una categoría con ese nombre'
  },

  // Archivos
  FILE: {
    NO_FILE: 'No se proporcionó ningún archivo',
    INVALID_FORMAT: 'Formato de archivo no válido',
    TOO_LARGE: 'El archivo es demasiado grande',
    UPLOAD_FAILED: 'Error al subir el archivo'
  },

  // Sistema
  SYSTEM: {
    DATABASE_ERROR: 'Error en la base de datos',
    SERVER_ERROR: 'Error interno del servidor',
    SERVICE_UNAVAILABLE: 'Servicio no disponible temporalmente'
  }
};

export const SUCCESS_MESSAGES = {
  // Recursos generales
  CREATED: 'Recurso creado exitosamente',
  UPDATED: 'Recurso actualizado exitosamente',
  DELETED: 'Recurso eliminado exitosamente',
  RETRIEVED: 'Datos obtenidos exitosamente',

  // Autenticación
  AUTH: {
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    REGISTER_SUCCESS: 'Usuario registrado exitosamente',
    LOGOUT_SUCCESS: 'Sesión cerrada exitosamente'
  },

  // Productos
  PRODUCT: {
    CREATED: 'Producto creado exitosamente',
    UPDATED: 'Producto actualizado exitosamente',
    DELETED: 'Producto eliminado exitosamente',
    STATE_UPDATED: 'Estado del producto actualizado correctamente',
    IMAGE_UPLOADED: 'Imagen del producto subida exitosamente'
  },

  // Usuarios
  USER: {
    CREATED: 'Usuario creado exitosamente',
    UPDATED: 'Usuario actualizado exitosamente',
    STATE_UPDATED: 'Estado del usuario actualizado correctamente'
  },

  // Órdenes
  ORDER: {
    CREATED: 'Orden creada exitosamente',
    UPDATED: 'Orden actualizada exitosamente',
    STATE_UPDATED: 'Estado de la orden actualizado correctamente'
  }
};