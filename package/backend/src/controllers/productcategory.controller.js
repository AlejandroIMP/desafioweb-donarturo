import {getConnection} from '../database/connection.js';
import pkg from 'mssql';
const TYPES = pkg;

export const getProductcategory = async (req, res) => {
    const pool = await getConnection();

    const categories = await pool.request().query('SELECT * FROM CategoriaProductos');

    return res.status(200).json(categories.recordset);
};

export const getProductCategoryById = async (req, res) => {
  try {
      const { id } = req.params;
      const pool = await getConnection();
      const category = await pool.request()
          .input('id', id)
          .query('SELECT * FROM CategoriaProductos WHERE idCategoriaProductos = @id');  
      
      if (category.recordset.length > 0) {
          res.json(category.recordset[0]);
      } else {
          res.status(404).json({ message: 'Categoria no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const createProductCategory = async(req, res) => {
    try{
        const { idusuarios, nombre, feachaCreacion, estado } = req.body;
        const pool = await getConnection();

        await pool.request()
            .input('idusuarios', TYPES.Int, idusuarios)
            .input('nombre', TYPES.VarChar, nombre)
            .input('feachaCreacion', TYPES.DateTime, feachaCreacion || new Date())
            .input('estado', TYPES.Int,  estado)
            .query('exec insertCategoria_Prodcutos @idusuarios, @nombre, @feachaCreacion, @estado');

        res.status(201).json({ message: 'Categoria creada' });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

export const updateProductCategory = async(req, res) => {
   try{
    const { id } = req.params;
    const { idusuarios, nombre, estado } = req.body;
    const pool = await getConnection();

    await pool.request()
        .input('id', TYPES.Int, id)
        .input('idusuarios', TYPES.Int, idusuarios)
        .input('nombre', TYPES.VarChar, nombre)
        .input('estado', TYPES.Int, estado)
        .query('exec updateCategoria_Productos @id, @idusuarios, @nombre, @estado');

    res.status(201).json({ message: 'Categoria actualizada' });

   }catch(error){
      res.status(500).json({ message: error.message });
   }
};

export const updateProductCategoryState = async(req, res) => {
    try{
        const { id } = req.params;
        const { estado } = req.body;
        const pool = await getConnection();

        await pool.request()
            .input('id', TYPES.Int, id)
            .input('estado', TYPES.Int, estado)
            .query('exec updateCategoriaProductos_idestados @id, @estado');

        res.status(201).json({ message: 'Estado de la categoria actualizado' });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};