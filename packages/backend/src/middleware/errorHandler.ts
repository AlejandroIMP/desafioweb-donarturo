import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../helpers/responseHelper';
import { SequelizeErrorHandler } from '../helpers/sequelizeErrorHandler';
import { SimpleLogger } from '../helpers/logger';
import { CustomError, ErrorHandler } from '../interfaces/helper.interface';
import { ERROR_MESSAGES } from '../enums/errorMessages';

export class AppError extends Error implements CustomError {
  public statusCode: number;
  public isOperational: boolean;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Estrategias para diferentes tipos de errores
class JWTErrorHandler implements ErrorHandler {
  canHandle(error: any): boolean {
    return error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError';
  }

  handle(res: Response, error: any): void {
    if (error.name === 'JsonWebTokenError') {
      ResponseHelper.unauthorized(res, ERROR_MESSAGES.AUTH.TOKEN_INVALID);
    } else if (error.name === 'TokenExpiredError') {
      ResponseHelper.unauthorized(res, ERROR_MESSAGES.AUTH.TOKEN_EXPIRED);
    }
  }
}

class MulterErrorHandler implements ErrorHandler {
  canHandle(error: any): boolean {
    return error.name === 'MulterError';
  }

  handle(res: Response, error: any): void {
    if (error.message.includes('File too large')) {
      ResponseHelper.badRequest(res, ERROR_MESSAGES.FILE.TOO_LARGE);
    } else {
      ResponseHelper.badRequest(res, ERROR_MESSAGES.FILE.UPLOAD_FAILED);
    }
  }
}

class AppErrorHandler implements ErrorHandler {
  canHandle(error: any): boolean {
    return error instanceof AppError && error.isOperational;
  }

  handle(res: Response, error: AppError): void {
    const statusCode = error.statusCode || 500;

    switch (statusCode) {
      case 400:
        ResponseHelper.badRequest(res, error.message);
        break;
      case 401:
        ResponseHelper.unauthorized(res, error.message);
        break;
      case 403:
        ResponseHelper.forbidden(res, error.message);
        break;
      case 404:
        ResponseHelper.notFound(res, error.message);
        break;
      case 409:
        ResponseHelper.conflict(res, error.message);
        break;
      default:
        ResponseHelper.internalError(res, error.message);
    }
  }
}

export class GlobalErrorHandler {
  private errorHandlers: ErrorHandler[] = [];
  private logger: SimpleLogger;

  constructor() {
    this.logger = new SimpleLogger();
    this.registerDefaultHandlers();
  }

  private registerDefaultHandlers(): void {
    this.errorHandlers = [
      new SequelizeErrorHandler(this.logger),
      new JWTErrorHandler(),
      new MulterErrorHandler(),
      new AppErrorHandler()
    ];
  }

  registerHandler(handler: ErrorHandler): void {
    this.errorHandlers.unshift(handler); // Agregar al inicio para prioridad
  }

  handle(error: CustomError, req: Request, res: Response, next: NextFunction): void {
    // Log detallado del error
    this.logger.error('Error Details:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      timestamp: new Date().toISOString()
    });

    // Si ya se envió la respuesta, delegar al manejador por defecto
    if (res.headersSent) {
      return next(error);
    }

    // Buscar el manejador apropiado
    const handler = this.errorHandlers.find(h => h.canHandle(error));

    if (handler) {
      handler.handle(res, error);
    } else {
      // Error no manejado - error del sistema
      ResponseHelper.internalError(
        res,
        ERROR_MESSAGES.SYSTEM.SERVER_ERROR,
        process.env.NODE_ENV === 'development' ? error.message : undefined
      );
    }
  }
}

// Instancia global del manejador de errores
const globalErrorHandler = new GlobalErrorHandler();

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  globalErrorHandler.handle(error, req, res, next);
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Ruta ${req.originalUrl} no encontrada`, 404);
  next(error);
};

// Wrapper para async functions
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Exportar la instancia para registrar manejadores personalizados
export { globalErrorHandler };