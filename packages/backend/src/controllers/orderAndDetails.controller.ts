import { Request, Response, NextFunction } from 'express';
import {Order, OrderDetail} from '../models/orderAndDetails.models';
import { OrderRequest, IOrder } from '../interfaces/orderAndDetails.interface';
import sequelize from '../database/connection';
import { QueryTypes } from 'sequelize';

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try{
    const orders = await Order.findAll({
      logging: console.log
    });

    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch(error){
    res.status(500).json({
      success: false,
      message: 'Error al obtener ordenes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  };
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try{
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if(order){
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
  } catch(error){
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
    
    orderData.idusuarios = userData?.idusuarios;

    const [results]: any = await sequelize.query(
      `EXEC InsertarOrdenConDetallesJSON 
        @idusuarios = :idusuarios,
        @estados_idestados = :estados_idestados,
        @nombre_completo = :nombre_completo,
        @direccion = :direccion,
        @telefono = :telefono,
        @correo_electronico = :correo_electronico,
        @fecha_entrega = :fecha_entrega,
        @Clientes_idClientes = :Clientes_idClientes,
        @DetallesProductos = :DetallesProductos`,
      {
        replacements: {
          idusuarios: orderData.idusuarios || null,
          estados_idestados: orderData.estados_idestados,
          nombre_completo: orderData.nombre_completo,
          direccion: orderData.direccion,
          telefono: orderData.telefono,
          correo_electronico: orderData.correo_electronico,
          fecha_entrega: orderData.fecha_entrega,
          Clientes_idClientes: orderData.Clientes_idClientes,
          DetallesProductos: JSON.stringify(orderData.DetallesProductos)
        },
        type: QueryTypes.RAW,
        logging: console.log 
      }
    );

    const idOrden = results?.[0]?.idOrden;

    if (!idOrden) {
      throw new Error('No se pudo obtener el ID de la orden');
    }

    res.status(201).json({
      success: true,
      data: idOrden ,
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

export const updateOrder = async(req: Request, res: Response): Promise<void> => {
  try{
    const { id } = req.params;
    const orderData: IOrder = req.body;
    const order = await Order.findByPk(id);

    if(!order){
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
  } catch(error){
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la orden',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateOrderState = async(req: Request, res: Response): Promise<void> => {
  try{
    const { id } = req.params;
    const { estados_idestados } = req.body;
    const order = await Order.findByPk(id);

    if(!order){
      res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
      return;
    }

    await order.update({ estados_idestados });

    res.status(200).json({
        success: true,
        message: 'Estado de la orden actualizado correctamente',
        data: order
      });
  } catch(error){
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado de la orden',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export const getOrderByUser = async(req: Request, res: Response): Promise<void> => {
  try{
    const userData = req.user;
    const orders = await Order.findAll({
      where: {
        idusuarios: userData?.idusuarios
      }
    });

    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch(error){
    res.status(500).json({
      success: false,
      message: 'Error al obtener ordenes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  };
}

export const getOrderDetailsById = async(req: Request, res: Response): Promise<void> => {
  try{
    const { id } = req.params;

    if(!id){
      res.status(400).json({
        success: false,
        message: 'ID de orden no proporcionado'
      });
      return;
    }
    const orderDetails = await OrderDetail.findAll({
      where: {
        idOrden: id
      }
    });

    res.status(200).json({
      success: true,
      data: orderDetails,
      count: orderDetails.length
    });
  } catch(error){
    
    res.status(500).json({
      success: false,
      message: 'Error al obtener los detalles de la orden',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
