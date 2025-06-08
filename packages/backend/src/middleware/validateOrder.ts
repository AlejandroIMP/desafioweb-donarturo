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
      'client_id',
      'state_id',
      'customer_name',
      'delivery_address',
      'phone',
      'email'
    ];

    requiredFields.forEach(field => {
      if (!orderData[field as keyof OrderRequest]) {
        errors.push(`El campo ${field} es requerido`);
      }
    });

    // Email validation
    if (orderData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.email)) {
      errors.push('El formato del email es inválido');
    }

    // Phone validation
    if (orderData.phone && orderData.phone.length < 8) {
      errors.push('El teléfono debe tener al menos 8 caracteres');
    }

    // Validate product_details
    if (!Array.isArray(orderData.product_details) || orderData.product_details.length === 0) {
      errors.push('product_details debe ser un array no vacío');
    } else {
      orderData.product_details.forEach((detail, index) => {
        if (!detail.product_id || !detail.quantity || !detail.unit_price) {
          errors.push(`Detalle de producto ${index + 1} inválido: faltan campos requeridos`);
        }
        
        if (detail.quantity <= 0) {
          errors.push(`Detalle de producto ${index + 1}: la cantidad debe ser mayor a 0`);
        }
        
        if (detail.unit_price <= 0) {
          errors.push(`Detalle de producto ${index + 1}: el precio debe ser mayor a 0`);
        }

        if (detail.discount_percentage && (detail.discount_percentage < 0 || detail.discount_percentage > 100)) {
          errors.push(`Detalle de producto ${index + 1}: el descuento debe estar entre 0 y 100`);
        }
      });
    }

    // Validate delivery_date if provided
    if (orderData.delivery_date) {
      const deliveryDate = new Date(orderData.delivery_date);
      const now = new Date();
      if (deliveryDate <= now) {
        errors.push('La fecha de entrega debe ser posterior a la fecha actual');
      }
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