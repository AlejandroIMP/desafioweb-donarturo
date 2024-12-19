import {getConnection} from '../database/connection.js';

export const getState = async (req, res) => {
    const pool = await getConnection();

    const result = await pool.request().query('SELECT * FROM Estados');

    console.log(result);

    res.send('GET estados');
};

export const getStateById = async (req, res) => {
  try {
      const { id } = req.params;
      const pool = await getConnection();
      const result = await pool.request()
          .input('id', id)
          .query('SELECT * FROM Estados WHERE idEstado = @id');  
      
      if (result.recordset.length > 0) {
          res.json(result.recordset[0]);
      } else {
          res.status(404).json({ message: 'State no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const createState = (req, res) => {
    res.send('POST State');
};

export const updateState = (req, res) => {
    res.send('PUT State/:id');
};

export const deleteState = (req, res) => {
    res.send('DELETE State/:id');
};