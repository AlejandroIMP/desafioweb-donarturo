import {getConnection} from '../database/connection.js';
import pkg from 'mssql';
const { Int, VarChar, Float, DateTime, Binary } = pkg;

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

export const createProduct = async (req, res) => {
    try {
        const { 
            categoriaProductosId, 
            usuarioId, 
            name, 
            marca, 
            codigo, 
            stock, 
            estadoId, 
            precio, 
            fechaCreacion, 
            foto 
        } = req.body;

        // Validate required fields
        if (!name || !codigo || !stock || !precio) {
            return res.status(400).json({ 
                message: 'Campos obligatorios faltantes' 
            });
        }

        const pool = await getConnection();
        await pool.request()
            .input('categoriaProductoId', Int, categoriaProductosId)
            .input('usuarioId', Int, usuarioId)
            .input('name', VarChar, name)
            .input('marca', VarChar, marca)
            .input('codigo', VarChar, codigo)
            .input('stock', Float, stock)
            .input('estadoId', Int, estadoId)
            .input('precio', Float, precio)
            .input('fechaCreacion', DateTime, fechaCreacion || new Date())
            .input('foto', Binary, foto)
            .query('exec insertProductos @categoriaProductoId, @usuarioId, @name, @marca, @codigo, @stock, @estadoId, @precio, @fechaCreacion, @foto;');
        
        res.json({ 
            success: true,
            message: 'Producto creado correctamente' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error al crear el producto',
            error: error.message 
        });
    }
};

export const updateProduct = async (req, res) => {
    try{
        const { id } = req.params;
        const { 
            categoriaProductosId, 
            usuarioId, 
            name, 
            marca, 
            codigo, 
            stock, 
            estadoId, 
            precio, 
            fechaCreacion, 
            foto 
        } = req.body;

        // Validate required fields
        if (!name || !codigo || !stock || !precio) {
            return res.status(400).json({ 
                message: 'Campos obligatorios faltantes' 
            });
        }

        const pool = await getConnection();
        
        await pool.request()
            .input('id', Int, id)
            .input('categoriaProductoId', Int, categoriaProductosId)
            .input('usuarioId', Int, usuarioId)
            .input('name', VarChar, name)
            .input('marca', VarChar, marca)
            .input('codigo', VarChar, codigo)
            .input('stock', Float, stock)
            .input('estadoId', Int, estadoId)
            .input('precio', Float, precio)
            .input('fechaCreacion', DateTime, fechaCreacion || new Date())
            .input('foto', Binary, foto)
            .query('exec updateProductos @id, @categoriaProductoId, @usuarioId, @name, @marca, @codigo, @stock, @estadoId, @precio, @fechaCreacion, @foto;');
        
        res.json({ 
            success: true,
            message: 'Producto actualizado correctamente' 
        });

    }catch{
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el producto',
            error: error.message
        })
    }
    res.send('PUT productos/:id');
};

export const deleteProduct = async (req, res) => {
    try{
        const { id } = req.params;
        const pool = await getConnection();
        await pool.request()
            .input('id', Int, id)
            .query('exec deleteProductos @id');

        res.json({
            success: true,
            message: 'Producto eliminado correctamente'
        });
    } catch{
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el producto',
            error: error.message
        });
    }
    
};

export const updateProductState = async(req, res) => {
    try{
        const { id } = req.params;
        const { estadoId } = req.body;

        const pool = await getConnection();

        await pool.request()
            .input('id', Int, id)
            .input('estadoId', Int, estadoId)
            .query('exec updateProducto_idestados @id, @estadoId');

        res.json({
            success: true,
            message: 'Estado del producto actualizado correctamente'
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el estado del producto',
            error: error.message
        });
    }
}

