import { Response } from 'express';
import { ApiResponse, MetaData } from '../interfaces/helper.interface';

export class ResponseBuilder {
  /**
   * Construye una respuesta API estándar
   */
  private static buildResponse<T>(
    success: boolean,
    message: string,
    options: {
      data?: T;
      error?: string;
      errors?: string[];
      meta?: Partial<MetaData>;
    } = {}
  ): ApiResponse<T> {
    const { data, error, errors, meta = {} } = options;
    
    return {
      success,
      message,
      ...(data !== undefined && { data }),
      ...(error && { error }),
      ...(errors && { errors }),
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    };
  }

  /**
   * Envía una respuesta exitosa
   */
  static sendSuccess<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
    meta?: Partial<MetaData>
  ): void {
    const response = this.buildResponse(true, message, { data, meta });
    res.status(statusCode).json(response);
  }

  /**
   * Envía una respuesta de error
   */
  static sendError(
    res: Response,
    statusCode: number,
    message: string,
    error?: string,
    errors?: string[]
  ): void {
    const response = this.buildResponse(false, message, { error, errors });
    res.status(statusCode).json(response);
  }
}