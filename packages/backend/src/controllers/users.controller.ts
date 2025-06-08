import { Request, Response } from 'express';
import User from '../models/auth.models';
import { IUser } from '../interfaces/auth.interface';
import bcrypt from 'bcryptjs';

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash', 'is_deleted'] },
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash', 'is_deleted'] }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validate required fields
    if (!userData.email || !userData.password_hash || !userData.full_name) {
      res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: email, password_hash, full_name'
      });
      return;
    }

    if (!emailRegex.test(userData.email)) {
      res.status(400).json({ 
        success: false,
        message: 'Email no válido' 
      });
      return;
    }

    const emailExists = await User.findOne({
      where: { email: userData.email }
    });

    if (emailExists) {
      res.status(400).json({
        success: false,
        message: 'El correo electronico ya esta registrado'
      });
      return;
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password_hash, salt)

    userData.password_hash = hashedPassword;

    const user = await User.create(userData);
    res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el usuario',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    if (userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        res.status(400).json({ 
          success: false,
          message: 'Email no válido' 
        });
        return;
      }

      const emailExists = await User.findOne({
        where: { email: userData.email }
      });

      if (emailExists && emailExists.user_id !== user.user_id) {
        res.status(400).json({
          success: false,
          message: 'El correo electronico ya esta registrado'
        });
        return;
      }
    }

    if (userData.password_hash) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password_hash, salt)
      userData.password_hash = hashedPassword;
    }

    await user.update(userData);
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el usuario',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateUserState = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { state_id } = req.body;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }
    
    await user.update({ state_id });
    res.status(200).json({
      success: true,
      message: 'Estado del usuario actualizado correctamente',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado del usuario',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Soft delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    await user.update({ deleted_at: new Date() });
    res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el usuario',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};