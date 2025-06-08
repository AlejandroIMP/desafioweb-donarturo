import { Logger } from '../interfaces/helper.interface';

export class SimpleLogger implements Logger {
  error(message: string, context?: any): void {
    console.error(`[ERROR] ${message}`, context ? JSON.stringify(context, null, 2) : '');
  }

  info(message: string, context?: any): void {
    console.info(`[INFO] ${message}`, context ? JSON.stringify(context, null, 2) : '');
  }

  debug(message: string, context?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, context ? JSON.stringify(context, null, 2) : '');
    }
  }
}