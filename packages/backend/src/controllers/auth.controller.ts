/**
 * Authentication controller handling login and registration functionality
 * @module AuthController
 */

/**
 * Handles user login authentication
 * @async
 * @param {Request} req - Express request object containing login credentials
 * @param {Response} res - Express response object
 * @returns {Promise<void>} - Returns void with HTTP response
 * 
 * @throws {AppError} - Returns 400 if email/password missing
 * @throws {AppError} - Returns 404 if user not found
 * @throws {AppError} - Returns 401 if password invalid or user inactive
 * @throws {AppError} - Returns 403 if account is locked or deleted
 */

/**
 * Handles new user registration
 * @async
 * @param {Request} req - Express request object containing user data
 * @param {Response} res - Express response object
 * @returns {Promise<void>} - Returns void with HTTP response
 * 
 * @throws {AppError} - Returns 400 if required fields missing, invalid email, or email exists
 */
import { Request, Response } from 'express';
import { TokenPayload } from '../interfaces/token.interface';
import { IUser } from '../interfaces/auth.interface';
import User from '../models/auth.models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { ResponseHelper } from '../helpers/responseHelper';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../enums/errorMessages';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validación de campos requeridos
  if (!email || !password) {
    throw new AppError(ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS + ': correo electrónico y contraseña', 400);
  }

  // Buscar usuario incluyendo los eliminados (soft delete)
  const theUser = await User.scope('withDeleted').findOne({
    where: { email }
  });

  // Verificar si el usuario existe
  if (!theUser) {
    throw new AppError(ERROR_MESSAGES.USER.NOT_FOUND, 404);
  }

  // Verificar si la cuenta ha sido eliminada
  if (theUser.deleted_at) {
    throw new AppError(ERROR_MESSAGES.AUTH.ACCOUNT_DELETED, 403);
  }

  // Verificar si la cuenta está bloqueada
  if (theUser.locked_until && new Date() < theUser.locked_until) {
    throw new AppError(ERROR_MESSAGES.AUTH.ACCOUNT_LOCKED, 403);
  }

  // Resetear bloqueo si ha pasado el tiempo
  if (theUser.locked_until && new Date() >= theUser.locked_until) {
    await theUser.update({
      locked_until: undefined,
      failed_login_attempts: 0
    });
  }

  // Verificar contraseña
  const validatePassword = await bcrypt.compare(password, theUser.password_hash);
  
  if (!validatePassword) {
    // Incrementar intentos fallidos
    const newAttempts = theUser.failed_login_attempts + 1;
    const updateData: any = { failed_login_attempts: newAttempts };

    // Bloquear cuenta si alcanza el máximo de intentos
    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      updateData.locked_until = new Date(Date.now() + LOCK_TIME);
    }

    await theUser.update(updateData);

    // Respuesta con info de intentos restantes
    throw new AppError('Contraseña incorrecta', 401, true, {
      attempts_remaining: Math.max(0, MAX_LOGIN_ATTEMPTS - newAttempts)
    });
  }

  // Verificar si el estado del usuario es activo
  if (theUser.state_id !== 1) {
    throw new AppError('El usuario no se encuentra activo', 401);
  }

  // Resetear intentos fallidos en login exitoso
  await theUser.update({
    failed_login_attempts: 0,
    last_login: new Date()
  });

  // Generar token JWT
  const payload: TokenPayload = {
    user_id: theUser.user_id,
    email: theUser.email,
    role_id: theUser.role_id
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );

  // Respuesta exitosa
  ResponseHelper.success(res, {
    token,
    user: {
      user_id: theUser.user_id,
      email: theUser.email,
      full_name: theUser.full_name,
      role_id: theUser.role_id
    }
  }, SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS);
});

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userData: IUser = req.body;
  
  // Validación de campos requeridos
  if (!userData.email || !userData.password_hash || !userData.full_name) {
    throw new AppError(
      ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS + ': email, contraseña y nombre completo', 
      400
    );
  }
  
  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    throw new AppError(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL, 400);
  }
  
  // Verificar si el email ya está registrado
  const emailExists = await User.findOne({
    where: { email: userData.email }
  });
  
  if (emailExists) {
    throw new AppError(ERROR_MESSAGES.USER.EMAIL_EXISTS, 409); // 409 Conflict es más apropiado para este caso
  }

  // Generar hash de contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password_hash, salt);

  // Establecer valores por defecto para nuevo usuario
  const newUserData = {
    ...userData,
    password_hash: hashedPassword,
    role_id: userData.role_id || 2, // Rol predeterminado (asumiendo que 2 es 'cliente')
    state_id: userData.state_id || 1, // Estado predeterminado (asumiendo que 1 es 'activo')
    failed_login_attempts: 0,
    is_active: true
  };
  
  // Crear usuario en la base de datos
  const newUser = await User.create(newUserData);

  // Respuesta exitosa
  ResponseHelper.created(res, {
    user: {
      user_id: newUser.user_id,
      email: newUser.email,
      full_name: newUser.full_name,
      role_id: newUser.role_id,
      state_id: newUser.state_id
    }
  }, SUCCESS_MESSAGES.AUTH.REGISTER_SUCCESS);
});