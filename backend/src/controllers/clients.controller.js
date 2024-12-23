import {getConnection} from '../database/connection.js';
import pkg from 'mssql';
const TYPES = pkg;

export const getClient = async (req, res) => {
    const pool = await getConnection();

    const Clientes = await pool.request().query('SELECT * FROM Clientes');

    res.status(200).json(Clientes.recordset);
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
      res.status(200).json(result.recordset);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const createClient = async (req, res) => {
    try {
        const { 
            razon_s,
            nombre_comercial,
            direccion,
            telefono,
            email
        } = req.body;

        // Validate required fields
        if (!razon_s || !direccion || !telefono || !email) {
            return res.status(400).json({ 
                message: 'Campos obligatorios faltantes' 
            });
        }

        const pool = await getConnection();
        await pool.request()
            .input('razon_s', TYPES.VarChar, razon_s)
            .input('nombre_comercial', TYPES.VarChar, nombre_comercial)
            .input('direccion', TYPES.VarChar, direccion)
            .input('telefono', TYPES.VarChar, telefono)
            .input('email', TYPES.VarChar, email)
            .query('exec insertClientes @razon_s, @nombre_comercial, @direccion, @telefono, @email;');
        
        res.status(201).json({ 
            success: true,
            message: 'Cliente creado correctamente' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error al crear el Cliente',
            error: error.message 
        });
    }
};

export const updateClient = async (req, res) => {
    try{
        const { id } = req.params;
        const {
            razon_s,
            nombre_comercial,
            direccion,
            telefono,
            email
        } = req.body;

        const pool = await getConnection();

        await pool.request()
            .input('id', TYPES.Int, id)
            .input('razon_s', TYPES.VarChar, razon_s)
            .input('nombre_comercial', TYPES.VarChar, nombre_comercial)
            .input('direccion', TYPES.VarChar, direccion)
            .input('telefono', TYPES.VarChar, telefono)
            .input('email', TYPES.VarChar, email)
            .query('exec updateClientes @id, @razon_s, @nombre_comercial, @direccion, @telefono, @email');
        
        res.status(200).json({ 
            success: true,
            message: 'Producto actualizado correctamente' 
        });

    }catch{
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el cliente',
            error: error.message
        })
    }
};

// export const deleteClient = async (req, res) => {
//     try{
//         const { id } = req.params;
//         const pool = await getConnection();
//         await pool.request()
//             .input('id', Int, id)
//             .query('exec deleteProductos @id');

//         res.json({
//             success: true,
//             message: 'Producto eliminado correctamente'
//         });
//     } catch{
//         res.status(500).json({
//             success: false,
//             message: 'Error al eliminar el producto',
//             error: error.message
//         });
//     }
    
// };

// export const updateClientState = async(req, res) => {
//     try{
//         const { id } = req.params;
//         const { estadoId } = req.body;

//         const pool = await getConnection();

//         await pool.request()
//             .input('id', TYPES.Int, id)
//             .input('estadoId', TYPES.Int, estadoId)
//             .query('exec updateClientes_idestados @id, @estadoId');

//         res.json({
//             success: true,
//             message: 'Estado del producto actualizado correctamente'
//         });

//     }catch(error){
//         res.status(500).json({
//             success: false,
//             message: 'Error al actualizar el estado del producto',
//             error: error.message
//         });
//     }
// }

