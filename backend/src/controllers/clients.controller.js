import {getConnection} from '../database/connection.js';

export const getClient = async (req, res) => {
    const pool = await getConnection();

    const result = await pool.request().query('SELECT * FROM Clientes');

    console.log(result);

    res.send('GET clientes');
};

export const getClientById = async (req, res) => {
  try {
      const { id } = req.params;
      const pool = await getConnection();
      const result = await pool.request()
          .input('id', id)
          .query('SELECT * FROM Clientes WHERE idClientes = @id');  
      
      if (result.recordset.length > 0) {
          res.json(result.recordset[0]);
      } else {
          res.status(404).json({ message: 'Cliente no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const createClient = (req, res) => {
    res.send('POST clientes');
};

export const updateClient = (req, res) => {
    res.send('PUT clientes/:id');
};

export const deleteClient = (req, res) => {
    res.send('DELETE clientes/:id');
};