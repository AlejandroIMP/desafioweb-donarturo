import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: string[];
  meta?: MetaData;
}

export interface MetaData {
  timestamp: string;
  total?: number;
  page?: number;
  limit?: number;
  [key: string]: unknown; // Tipado flexible pero seguro
}

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  details?: any;
}

export interface ErrorHandler {
  canHandle(error: any): boolean;
  handle(res: Response, error: any): void;
}

export interface Logger {
  error(message: string, context?: any): void;
  info(message: string, context?: any): void;
  debug(message: string, context?: any): void;
}