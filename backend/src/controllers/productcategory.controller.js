import {getConnection} from '../database/connection.js';

export const getProductcategory = async (req, res) => {
    const pool = await getConnection();

    const result = await pool.request().query('SELECT * FROM CategoriaProductos');

    console.log(result);

    res.send('GET productCategory');
};

export const getProductCategoryById = async (req, res) => {
  try {
      const { id } = req.params;
      const pool = await getConnection();
      const result = await pool.request()
          .input('id', id)
          .query('SELECT * FROM CategoriaProductos WHERE idCategoriaProductos = @id');  
      
      if (result.recordset.length > 0) {
          res.json(result.recordset[0]);
      } else {
          res.status(404).json({ message: 'Categoria no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const createProductCategory = (req, res) => {
    res.send('POST Categoria');
};

export const updateProductCategory = (req, res) => {
    res.send('PUT Categoria/:id');
};

export const deleteProductCategory = (req, res) => {
    res.send('DELETE Categoria/:id');
};