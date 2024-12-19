import {getConnection} from '../database/connection.js';

export const getProducts = async (req, res) => {
    const pool = await getConnection();

    const result = await pool.request().query('SELECT * FROM Productos');

    console.log(result);

    res.send('GET productos');
};

export const getProductById = async (req, res) => {
  try {
      const { id } = req.params;
      const pool = await getConnection();
      const result = await pool.request()
          .input('id', id)
          .query('SELECT * FROM Productos WHERE idProductos = @id');  
      
      if (result.recordset.length > 0) {
          res.json(result.recordset[0]);
      } else {
          res.status(404).json({ message: 'Producto no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const createProduct = (req, res) => {
    res.send('POST productos');
};

export const updateProduct = (req, res) => {
    res.send('PUT productos/:id');
};

export const deleteProduct = (req, res) => {
    res.send('DELETE productos/:id');
};