import {getConnection} from '../database/connection.js';

export const getOrder = async (req, res) => {
    const pool = await getConnection();

    const result = await pool.request().query('SELECT * FROM Orden');

    console.log(result);

    res.send('GET clientes');
};

export const getOrderById = async (req, res) => {
  try {
      const { id } = req.params;
      const pool = await getConnection();
      const result = await pool.request()
          .input('id', id)
          .query('SELECT * FROM Orden WHERE idOrden = @id');  
      
      if (result.recordset.length > 0) {
          res.json(result.recordset[0]);
      } else {
          res.status(404).json({ message: 'Cliente no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const createOrder = (req, res) => {
    res.send('POST clientes');
};

export const updateOrder = (req, res) => {
    res.send('PUT clientes/:id');
};

export const deleteOrder = (req, res) => {
    res.send('DELETE clientes/:id');
};