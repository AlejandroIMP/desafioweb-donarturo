import { Response } from 'express';
import { ErrorHandler, Logger } from '../interfaces/helper.interface';
import { ResponseBuilder } from './responseBuilder';

interface SequelizeErrorStrategy {
  canHandle(error: any): boolean;
  handle(res: Response, error: any): void;
}

class ValidationErrorStrategy implements SequelizeErrorStrategy {
  canHandle(error: any): boolean {
    return error.name === 'SequelizeValidationError';
  }

  handle(res: Response, error: any): void {
    const errors = error.errors.map((err: any) => err.message);
    ResponseBuilder.sendError(res, 400, 'Error de validación', undefined, errors);
  }
}

class UniqueConstraintErrorStrategy implements SequelizeErrorStrategy {
  canHandle(error: any): boolean {
    return error.name === 'SequelizeUniqueConstraintError';
  }

  handle(res: Response, error: any): void {
    const field = error.errors[0]?.path || 'campo';
    ResponseBuilder.sendError(res, 409, `El ${field} ya existe en el sistema`);
  }
}

class ForeignKeyConstraintErrorStrategy implements SequelizeErrorStrategy {
  canHandle(error: any): boolean {
    return error.name === 'SequelizeForeignKeyConstraintError';
  }

  handle(res: Response, error: any): void {
    ResponseBuilder.sendError(res, 400, 'Referencia inválida a otro recurso');
  }
}

class ConnectionErrorStrategy implements SequelizeErrorStrategy {
  canHandle(error: any): boolean {
    return error.name === 'SequelizeConnectionError';
  }

  handle(res: Response, error: any): void {
    ResponseBuilder.sendError(res, 500, 'Error de conexión a la base de datos');
  }
}

class GenericSequelizeErrorStrategy implements SequelizeErrorStrategy {
  canHandle(error: any): boolean {
    return error.name?.includes('Sequelize') || false;
  }

  handle(res: Response, error: any): void {
    const errorMessage = process.env.NODE_ENV === 'development' ? error.message : undefined;
    ResponseBuilder.sendError(res, 500, 'Error en la base de datos', errorMessage);
  }
}

export class SequelizeErrorHandler implements ErrorHandler {
  private strategies: SequelizeErrorStrategy[] = [
    new ValidationErrorStrategy(),
    new UniqueConstraintErrorStrategy(),
    new ForeignKeyConstraintErrorStrategy(),
    new ConnectionErrorStrategy(),
    new GenericSequelizeErrorStrategy() // Debe ir al final como fallback
  ];

  private logger?: Logger;

  constructor(logger?: Logger) {
    this.logger = logger;
  }

  canHandle(error: any): boolean {
    return error.name?.includes('Sequelize') || false;
  }

  handle(res: Response, error: any): void {
    // Log del error usando el logger inyectado
    this.logger?.error('Sequelize Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Buscar la estrategia apropiada
    const strategy = this.strategies.find(s => s.canHandle(error));
    
    if (strategy) {
      strategy.handle(res, error);
    } else {
      // Fallback si no hay estrategia
      ResponseBuilder.sendError(res, 500, 'Error desconocido en la base de datos');
    }
  }

  /**
   * Permite registrar nuevas estrategias (OCP)
   */
  registerStrategy(strategy: SequelizeErrorStrategy): void {
    // Insertar antes de la estrategia genérica
    this.strategies.splice(-1, 0, strategy);
  }
}