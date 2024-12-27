export function validateOrder(req, res, next) {
  const { idusuarios, estados_idestados, nombre_completo, direccion, telefono, correo_electronico, fecha_entrega, Clientes_idClientes, detallesProductos } = req.body;

  if (
    !idusuarios ||
    !estados_idestados ||
    !nombre_completo ||
    !direccion ||
    !telefono ||
    !correo_electronico ||
    !fecha_entrega ||
    !Clientes_idClientes ||
    !Array.isArray(detallesProductos) ||
    detallesProductos.length === 0
  ) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios y detallesProductos debe ser un array no vacío.' });
  }

  next();
}