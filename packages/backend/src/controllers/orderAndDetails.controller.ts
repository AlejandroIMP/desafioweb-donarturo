import { Request, Response, NextFunction } from 'express';
import {Order, OrderDetail} from '../models/orderAndDetails.models';
import { OrderRequest, IOrder } from '../interfaces/orderAndDetails.interface';
import sequelize from '../database/connection';
import { QueryTypes } from 'sequelize';

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.findAll({
      attributes: { exclude: ['is_deleted'] },
      order: [['created_at', 'DESC']],
      logging: console.log
    });

    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener ordenes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      attributes: { exclude: ['is_deleted'] }
    });

    if (order) {
      res.status(200).json({
        success: true,
        data: order
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la orden',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = req.user;
    const orderData: OrderRequest = req.body;
    
    orderData.user_id = userData?.user_id;

    const [results]: any = await sequelize.query(
      `EXEC InsertarOrdenConDetallesJSON 
        @user_id = :user_id,
        @state_id = :state_id,
        @customer_name = :customer_name,
        @delivery_address = :delivery_address,
        @phone = :phone,
        @email = :email,
        @delivery_date = :delivery_date,
        @client_id = :client_id,
        @product_details = :product_details`,
      {
        replacements: {
          user_id: orderData.user_id || null,
          state_id: orderData.state_id,
          customer_name: orderData.customer_name,
          delivery_address: orderData.delivery_address,
          phone: orderData.phone,
          email: orderData.email,
          delivery_date: orderData.delivery_date,
          client_id: orderData.client_id,
          product_details: JSON.stringify(orderData.product_details)
        },
        type: QueryTypes.RAW,
        logging: console.log 
      }
    );

    const order_id = results?.[0]?.order_id;

    if (!order_id) {
      throw new Error('No se pudo obtener el ID de la orden');
    }

    res.status(201).json({
      success: true,
      data: order_id,
      message: 'Orden creada exitosamente'
    });

  } catch (error) {
    console.error('Full error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la orden',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const orderData = req.body;
    const order = await Order.findByPk(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
      return;
    }

    await order.update(orderData);

    res.status(200).json({
      success: true,
      message: 'Orden actualizada correctamente',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la orden',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateOrderState = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { state_id } = req.body;
    const order = await Order.findByPk(id);
    const rol = (req as any).rol; // Type assertion for custom property

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
      return;
    }

    // Role-based authorization for state changes
    if (state_id === 1 && rol !== 1) {
      res.status(403).json({
        success: false,
        message: 'No tiene permisos para cambiar el estado de la orden a "Activo"'
      });
      return;
    }

    if (state_id === 2 && rol !== 1) {
      res.status(403).json({
        success: false,
        message: 'No tiene permisos para cambiar el estado de la orden a "Inactivo"'
      });
      return;
    }

    if (state_id === 3 && rol !== 1) {
      res.status(403).json({
        success: false,
        message: 'No tiene permisos para cambiar el estado de la orden a "En proceso"'
      });
      return;
    }

    if (state_id === 7 && rol !== 1) {
      res.status(403).json({
        success: false,
        message: 'No tiene permisos para cambiar el estado de la orden a "Confirmado"'
      });
      return;
    }

    if (state_id === 8 && rol !== 1) {
      res.status(403).json({
        success: false,
        message: 'No tiene permisos para cambiar el estado de la orden a "Entregado"'
      });
      return;
    }

    await order.update({ state_id });

    res.status(200).json({
      success: true,
      message: 'Estado de la orden actualizado correctamente',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado de la orden',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrderByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = req.user;
    const orders = await Order.findAll({
      where: {
        user_id: userData?.user_id
      },
      attributes: { exclude: ['is_deleted'] },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener ordenes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
      return;
    }

    await order.update({ is_deleted: true });

    res.status(200).json({
      success: true,
      message: 'Orden eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la orden',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrderDetailsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'ID de orden no proporcionado'
      });
      return;
    }
    
    const orderDetails = await OrderDetail.findAll({
      where: {
        order_id: id
      },
      attributes: { exclude: ['is_deleted'] },
      order: [['created_at', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: orderDetails,
      count: orderDetails.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los detalles de la orden',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
