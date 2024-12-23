import {getConnection} from '../database/connection.js';
import pkg from 'mssql';
const TYPES = pkg;

export const getState = async (req, res) => {
    const pool = await getConnection();

    const states = await pool.request().query('SELECT * FROM Estados');

    res.status(200).json(states.recordset);
};

export const getStateById = async (req, res) => {
  try {
      const { id } = req.params;
      const pool = await getConnection();
      const result = await pool.request()
          .input('id', id)
          .query('SELECT * FROM estados WHERE idestados = @id');  
      
      if (!result.recordset.length > 0) {
        res.status(404).json({ message: 'State no encontrado' });
      }

      res.status(200).json(result.recordset);

  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const createState = async(req, res) => {
  try{
    const { nombre } = req.body;

    // Validate required fields
    if (!nombre) {
        return res.status(400).json({ 
            message: 'Campos obligatorios faltantes' 
        });
    }

    const pool = await getConnection();

    await pool.request()
        .input('nombre', TYPES.VarChar, nombre)
        .query('exec insertNewEstado @nombre');
    
    res.status(201).json({ message: 'Estado creado correctamente' });

  }catch(error){
    res.status(500).json({ message: error.message });
  }
};

export const updateState = async(req, res) => {
    try{
        const { id } = req.params;
        const { nombre } = req.body;
    
        if (!nombre) {
            return res.status(400).json({ 
                message: 'Campos obligatorios faltantes' 
            });
        }
    
        const pool = await getConnection();
    
        await pool.request()
            .input('id', TYPES.Int, id)
            .input('nombre', TYPES.VarChar, nombre)
            .query('exec updateEstado_Nombre @id, @nombre');
        
        res.status(200).json({ message: 'Estado actualizado correctamente' });
    }catch(error){
        res.status(500).json({ message: error.message });
    } 
};
