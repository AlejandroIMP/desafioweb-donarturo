import { Request, Response } from 'express';
import { TokenPayload } from '../interfaces/token.interface';
import { IUser } from '../interfaces/auth.interface';
import User from '../models/auth.models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo_electronico, user_password } = req.body;

    if (!correo_electronico || !user_password) {
      res.status(404).json({
        success: false,
        message: 'El correo electrónico y la contraseña son requeridos'
      });
      return;
    }

    const theUser = await User.findOne({
      where: { correo_electronico: correo_electronico },
      rejectOnEmpty: true,
    });

    const validatePassword = await bcrypt.compare(user_password, theUser.user_password);
    
    if (!validatePassword) {
      res.status(401).json({ 
        message: 'Contraseña incorrecta'
      });
      return;
    }

    const payload: TokenPayload = {
      id: theUser.idusuarios,
      email: theUser.correo_electronico,
      rol: theUser.rol_idrol
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Login exitoso',
      token,
      user: {
        id: theUser.idusuarios,
        email: theUser.correo_electronico,
        rol: theUser.rol_idrol
      }
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesion',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const register = async (req:Request, res:Response): Promise<void> => {
  try{
    const userData: IUser = req.body;
    
    
    if(!userData.rol_idrol || !userData.correo_electronico || !userData.user_password ){
      res.status(400).json({message: 'Rol, E-mail y contrasenia son requeridos'});
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.correo_electronico)) {
      res.status(400).json({ message: 'Email no válido' });
      return;
    }
    
    const emailExists = await User.findOne({
      where: { correo_electronico: userData.correo_electronico }
    })
    
    if (emailExists){
      res.status(400).json({
        success: false,
        message: 'El correo electronico ya esta registrado'
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.user_password, salt)

    userData.user_password = hashedPassword;
    
    const newUser = await User.create(userData);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      rol: newUser.rol_idrol,
      email: newUser.correo_electronico,
      estado: newUser.estados_idestados
    });

  }catch(error){
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return;
  }
};