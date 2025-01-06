import { Request, Response } from 'express';
import User from '../models/auth.models';
import { IUser } from '../interfaces/auth.interface';
import bcrypt from 'bcryptjs';

export const getUser = async (req:Request, res:Response): Promise<void> => {
  try{
    const users = await User.findAll();
    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  }catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserById = async (req:Request, res:Response): Promise<void> => {
  try{
    const { id } = req.params;
    const user = await User.findByPk(id);

    if(!user){
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createUser = async(req:Request, res:Response): Promise<void> => {
  try{
    const userData: IUser = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.correo_electronico)) {
      res.status(400).json({ message: 'Email no válido' });
      return;
    }

    const emailExists = await User.findOne({
      where: { correo_electronico: userData.correo_electronico }
    });

    if (emailExists){
      res.status(400).json({
        success: false,
        message: 'El correo electronico ya esta registrado'
      });
      return;
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.user_password, salt)

    userData.user_password = hashedPassword;

    const user = await User.create(userData);
    res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      data: user
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: 'Error al crear el usuario',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
  
};

export const updateUser = async(req:Request, res:Response): Promise<void> => {
  try{
    const { id } = req.params;
    const userData: IUser = req.body;
    const user = await User.findByPk(id);

    if(!user){
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.correo_electronico)) {
      res.status(400).json({ message: 'Email no válido' });
      return;
    }

    const emailExists = await User.findOne({
      where: { correo_electronico: userData.correo_electronico }
    });

    if (emailExists){
      res.status(400).json({
        success: false,
        message: 'El correo electronico ya esta registrado'
      });
      return;
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.user_password, salt)

    userData.user_password = hashedPassword;    

    await user.update(userData);
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: user
    });
  } catch(error){
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el usuario',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } 
};

export const updateUserState = async(req:Request, res:Response): Promise<void> => {
  try{
    const { id } = req.params;
    const { estados_idestados } = req.body;
    const user = await User.findByPk(id);

    if(!user){
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }
    await user.update({ estados_idestados });
    res.status(200).json({
      success: true,
      message: 'Estado del usuario actualizado correctamente',
      data: user
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado del usuario',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};