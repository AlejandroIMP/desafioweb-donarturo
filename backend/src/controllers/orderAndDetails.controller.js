import {getConnection} from '../database/connection.js';

export const getOrder = async (req, res) => {
    const pool = await getConnection();

    const result = await pool.request().query('SELECT * FROM Orden');

    console.log(result);

    return res.json(result.recordset);
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

export const createOrder = async (req, res) => {
  const { idusuarios, estados_idestados, nombre_completo, direccion, telefono, correo_electronico, fecha_entrega, Clientes_idClientes, detallesProductos } = req.body;
  
  try {
    const pool = await db; // Conexión a la base de datos
  
    const result = await pool.request()
      .input('idusuarios', sql.Int, idusuarios)
      .input('estados_idestados', sql.Int, estados_idestados)
      .input('nombre_completo', sql.NVarChar(255), nombre_completo)
      .input('direccion', sql.NVarChar(255), direccion)
      .input('telefono', sql.NVarChar(50), telefono)
      .input('correo_electronico', sql.NVarChar(255), correo_electronico)
      .input('fecha_entrega', sql.DateTime, fecha_entrega)
      .input('Clientes_idClientes', sql.Int, Clientes_idClientes)
        .input('DetallesProductos', sql.NVarChar(sql.MAX), JSON.stringify(detallesProductos))
      .execute('InsertarOrdenConDetalles'); // Llama al procedimiento almacenado

    res.status(201).json({
      message: 'Orden creada exitosamente.',
      idOrden: result.recordset[0]?.idOrden || null, // Devuelve el ID de la orden si es posible
    });
  } catch (error) {
    console.error('Error al insertar la orden:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
  }
}

export const updateOrder = (req, res) => {
    res.send('PUT clientes/:id');
};

export const updateOrderState = async(req, res) => {
  try{
    const { id } = req.params;
    const { estadoId } = req.body;

    const pool = await getConnection();

    await pool.request()
        .input('id', Int, id)
        .input('estadoId', Int, estadoId)
        .query('exec updateOrder_idestados @id, @estadoId');

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

export const deleteOrder = (req, res) => {
    res.send('DELETE clientes/:id');
};