import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pkg from 'mssql';
const TYPES = pkg;

import { getConnection } from '../database/connection.js';

export const login = async (req, res) => {
  try {
    const { correo_electronico, user_password } = req.body;

    if (!correo_electronico || !user_password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('correo_electronico', TYPES.VarChar, correo_electronico)
      .query('SELECT * FROM usuarios WHERE correo_electronico = @correo_electronico');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = result.recordset[0];
    const validatePassword = await bcrypt.compare(user_password, user.user_password);
    
    if (!validatePassword) {
      return res.status(401).json({ 
        message: 'Contraseña incorrecta'
      });
    }

    const token = jwt.sign(
      { 
        id: user.idusuarios, 
        email: user.correo_electronico, 
        rol: user.rol_idrol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({ 
      message: 'Login exitoso',
      token,
      user: {
        id: user.idusuarios,
        email: user.correo_electronico,
        rol: user.rol_idrol
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Error al iniciar sesión',
      error: error.message 
    });
  }
};

export const register = async (req, res) => {
  try{
    const { rolId, estadoId, email, nombre, user_pass, telefono, fecha, fechaCreacion, clientesId } = req.body

    
    if(!rolId || !email || !user_pass ){
      res.status(400).json({message: 'Rol, E-mail y contrasenia son requeridos'})
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email no válido' });
    }
    
    const pool = await getConnection();

    const emailExists = await pool.request()
    .input('correo_electronico', TYPES.VarChar, email)
      .query('SELECT TOP 1 1 FROM Usuarios WHERE correo_electronico = @correo_electronico');

    if (emailExists.recordset.length > 0){
      return res.status(400).json({message: 'El correo electronico ya esta registrado'})
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_pass, salt)

    await pool.request()
      .input('rolId', TYPES.Int, rolId)
      .input('estadoId', TYPES.Int, estadoId)
      .input('correo_electronico', TYPES.VarChar, email)
      .input('nombre', TYPES.VarChar, nombre)
      .input('contrasenia', TYPES.NVarChar(100) , hashedPassword)
      .input('telefono', TYPES.VarChar, telefono)
      .input('fecha', TYPES.Date, fecha ? new Date(fecha) : null)
      .input('fechaCreacion', TYPES.DateTime, fechaCreacion || new Date())
      .input('ClientesId', TYPES.Int, clientesId)
      .query('exec insertUsuarioS @rolId, @estadoId, @correo_electronico, @nombre, @contrasenia, @telefono, @fecha, @fechaCreacion, @ClientesId')

    res.status(201).json({message: 'Usuario registrado exitosamente'})

  }catch(error){
    res.status(500).json({message: 'Error al registrar usuario', error:   error.message})
  }
};