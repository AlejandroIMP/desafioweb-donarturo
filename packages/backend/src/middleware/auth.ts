/**
 * Middleware for verifying JWT tokens in request headers.
 * Extends Express.Request with user and role_id properties.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @throws {403} If no token is provided
 * @throws {500} If JWT_SECRET environment variable is not defined
 * @throws {404} If user associated with token is not found
 * @throws {401} If token is invalid
 * @throws {403} If user account is locked
 * @throws {403} If user account is deleted
 * @throws {500} If database query fails
 */

/**
 * Middleware factory for role-based access control.
 * Verifies if the authenticated user has one of the required roles.
 * 
 * @param roles - Array of role IDs that are allowed to access the route
 * @returns RequestHandler middleware function
 * @throws {403} If user's role is not included in the allowed roles
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/auth.models';
import { TokenPayload } from '../interfaces/token.interface';
import { RequestHandler } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      role_id?: number;
    }
  }
}

export const verifyToken: RequestHandler = (
  req: Request,
  res: Response, 
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(403).json({ message: 'No se proporcionó un token' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: 'JWT_SECRET is not defined' });
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    User.findByPk((payload as TokenPayload).user_id)
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'Usuario no encontrado' });
          return;
        }

        // Check if user account is deleted
        if (user.deleted_at) {
          res.status(403).json({ message: 'Cuenta de usuario eliminada' });
          return;
        }

        // Check if user account is locked
        if (user.locked_until && new Date() < user.locked_until) {
          res.status(403).json({ 
            message: 'Cuenta bloqueada temporalmente',
            locked_until: user.locked_until
          });
          return;
        }

        // Update last login if account is not locked
        if (!user.locked_until || new Date() >= user.locked_until) {
          user.update({ last_login: new Date() }).catch(console.error);
        }

        req.user = user;
        req.role_id = user.role_id;
        next();
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });

  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
    return;
  }
};

export const verifyRol = (roles: number[]): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!roles.includes(req.user?.role_id || 0)) {
    res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    return;
  }
  next();
};