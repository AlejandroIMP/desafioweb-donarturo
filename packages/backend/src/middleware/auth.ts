import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/auth.models';
import { TokenPayload } from '../interfaces/token.interface';
import { RequestHandler } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      rol?: number;
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
    
    User.findByPk((payload as TokenPayload).id)
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'Usuario no encontrado' });
          return;
        }
        req.user = user;
        req.rol = user.rol_idrol;
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
  if (!roles.includes(req.user?.rol_idrol || 0)) {
    res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    return;
  }
  next();
};