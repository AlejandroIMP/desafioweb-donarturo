import { Response } from 'express';
import { ResponseBuilder } from './responseBuilder';
import { SequelizeErrorHandler } from './sequelizeErrorHandler';
import { SimpleLogger } from './logger';
import { MetaData } from '../interfaces/helper.interface';

export class ResponseHelper {
  private static sequelizeErrorHandler = new SequelizeErrorHandler(new SimpleLogger());

  /**
   * Respuesta exitosa genérica
   */
  static success<T>(
    res: Response,
    data?: T,
    message: string = 'Operación exitosa',
    statusCode: number = 200,
    meta?: Partial<MetaData>
  ): void {
    ResponseBuilder.sendSuccess(res, statusCode, message, data, meta);
  }

  /**
   * Respuesta de recurso creado
   */
  static created<T>(
    res: Response,
    data?: T,
    message: string = 'Recurso creado exitosamente'
  ): void {
    this.success(res, data, message, 201);
  }

  /**
   * Respuesta de error de validación (400)
   */
  static badRequest(
    res: Response,
    message: string = 'Datos inválidos',
    errors?: string[]
  ): void {
    ResponseBuilder.sendError(res, 400, message, undefined, errors);
  }

  /**
   * Respuesta de no autorizado (401)
   */
  static unauthorized(
    res: Response,
    message: string = 'No autorizado'
  ): void {
    ResponseBuilder.sendError(res, 401, message);
  }

  /**
   * Respuesta de prohibido (403)
   */
  static forbidden(
    res: Response,
    message: string = 'No tienes permisos para realizar esta acción'
  ): void {
    ResponseBuilder.sendError(res, 403, message);
  }

  /**
   * Respuesta de recurso no encontrado (404)
   */
  static notFound(
    res: Response,
    message: string = 'Recurso no encontrado'
  ): void {
    ResponseBuilder.sendError(res, 404, message);
  }

  /**
   * Respuesta de conflicto (409)
   */
  static conflict(
    res: Response,
    message: string = 'Conflicto con el estado actual del recurso'
  ): void {
    ResponseBuilder.sendError(res, 409, message);
  }

  /**
   * Respuesta de error interno del servidor (500)
   */
  static internalError(
    res: Response,
    message: string = 'Error interno del servidor',
    error?: string
  ): void {
    ResponseBuilder.sendError(res, 500, message, error);
  }

  /**
   * Maneja errores de Sequelize usando la estrategia apropiada
   */
  static handleSequelizeError(res: Response, error: any): void {
    this.sequelizeErrorHandler.handle(res, error);
  }

  /**
   * Permite inyectar un manejador de errores personalizado para Sequelize
   */
  static setSequelizeErrorHandler(handler: SequelizeErrorHandler): void {
    this.sequelizeErrorHandler = handler;
  }
}
