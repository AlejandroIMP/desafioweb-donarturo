import {getConnection} from '../database/connection.js';
import pkg from 'mssql';
const TYPES = pkg;

export const getOrder = async (req, res) => {
    const pool = await getConnection();

    const result = await pool.request().query('SELECT * FROM Orden');

    return res.status(200).json(result.recordset);
};

export const getOrderById = async (req, res) => {
  try {
      const { id } = req.params;
      const pool = await getConnection();
      const result = await pool.request()
          .input('id', TYPES.Int,  id)
          .query('SELECT * FROM Orden WHERE idOrden = @id');  
      
      if (result.recordset.length > 0) {
          res.json(result.recordset[0]);
      } else {
          res.status(404).json({ message: 'Orden no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { 
      idusuarios, 
      estados_idestados, 
      nombre_completo, 
      direccion, 
      telefono, 
      correo_electronico, 
      fecha_entrega, 
      Clientes_idClientes, 
      detallesProductos 
    } = req.body;

    // Validate required fields
    if (!idusuarios || !estados_idestados || !nombre_completo || !direccion || !detallesProductos) {
      return res.status(400).json({ 
        error: 'Todos los campos obligatorios deben ser proporcionados' 
      });
    }

    // Validate detallesProductos is array
    if (!Array.isArray(detallesProductos) || detallesProductos.length === 0) {
      return res.status(400).json({ 
        error: 'detallesProductos debe ser un array no vacío' 
      });
    }

    const pool = await getConnection();
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      const result = await pool.request()
        .input('idusuarios', TYPES.Int, idusuarios)
        .input('estados_idestados', TYPES.Int, estados_idestados)
        .input('nombre_completo', TYPES.NVarChar(255), nombre_completo)
        .input('direccion', TYPES.NVarChar(255), direccion)
        .input('telefono', TYPES.NVarChar(50), telefono)
        .input('correo_electronico', TYPES.NVarChar(255), correo_electronico)
        .input('fecha_entrega', TYPES.DateTime, fecha_entrega ? new Date(fecha_entrega) : null)
        .input('Clientes_idClientes', TYPES.Int, Clientes_idClientes)
        .input('DetallesProductos', TYPES.NVarChar(TYPES.MAX), JSON.stringify(detallesProductos))
        .query(`
          EXEC InsertarOrdenConDetallesJSON
            @idusuarios,
            @estados_idestados,
            @nombre_completo,
            @direccion,
            @telefono,
            @correo_electronico,
            @fecha_entrega,
            @Clientes_idClientes,
            @DetallesProductos;
        `);

      await transaction.commit();

      res.status(201).json({
        success: true,
        message: 'Orden creada exitosamente',
        idOrden: result.recordset[0]?.idOrden
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al procesar la orden',
      details: error.message 
    });
  }
};

export const updateOrder = async(req, res) => {
  try{
      const { id } = req.params;
      const { idusuarios, estados_idestados, nombre_completo, direccion, telefono, correo_electronico, fecha_entrega, Clientes_idClientes } = req.body;

      const pool = await getConnection();

      await pool.request()
          .input('id', TYPES.Int, id)
          .input('idusuarios', TYPES.Int, idusuarios)
          .input('estados_idestados', TYPES.Int, estados_idestados)
          .input('nombre_completo', TYPES.NVarChar(255), nombre_completo)
          .input('direccion', TYPES.NVarChar(255), direccion)
          .input('telefono', TYPES.NVarChar(50), telefono)
          .input('correo_electronico', TYPES.NVarChar(255), correo_electronico)
          .input('fecha_entrega', TYPES.DateTime, fecha_entrega)
          .input('Clientes_idClientes', TYPES.Int, Clientes_idClientes)
          .query('exec updateOrden @id, @idusuarios, @estados_idestados, @nombre_completo, @direccion, @telefono, @correo_electronico, @fecha_entrega, @Clientes_idClientes');

      res.json({
          success: true,
          message: 'Orden actualizada correctamente'
      });
  }catch(error){
      res.status(500).json({
          success: false,
          message: 'Error al actualizar la orden',
          error: error.message
      });
  }
};

export const updateOrderState = async(req, res) => {
  try{
    const { id } = req.params;
    const { estadoId } = req.body;

    const pool = await getConnection();

    await pool.request()
        .input('id', TYPES.Int, id)
        .input('estadoId', TYPES.Int, estadoId)
        .query('exec updateOrden_idestado @id, @estadoId');

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