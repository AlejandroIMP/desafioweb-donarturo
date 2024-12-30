import { Request, Response, NextFunction, RequestHandler } from 'express';
import { OrderRequest } from '../interfaces/orderAndDetails.interface';

export const validateOrder: RequestHandler = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  try {
    const orderData = req.body as OrderRequest;
    const errors: string[] = [];

    // Required fields validation
    const requiredFields = [
      'estados_idestados',
      'nombre_completo',
      'direccion',
      'telefono',
      'correo_electronico',
      'fecha_entrega',
      'Clientes_idClientes'
    ];

    requiredFields.forEach(field => {
      if (!orderData[field as keyof OrderRequest]) {
        errors.push(`El campo ${field} es requerido`);
      }
    });

    // Validate detallesProductos
    if (!Array.isArray(orderData.DetallesProductos) || orderData.DetallesProductos.length === 0) {
      errors.push('detallesProductos debe ser un array no vacío');
    } else {
      orderData.DetallesProductos.forEach((detalle, index) => {
        if (!detalle.idProductos || !detalle.cantidad || !detalle.precio) {
          errors.push(`Detalle producto ${index + 1} inválido`);
        }
      });
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ 
      error: 'Error validando la orden',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};