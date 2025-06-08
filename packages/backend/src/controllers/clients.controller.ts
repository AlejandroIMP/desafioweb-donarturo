import { Request, Response } from 'express';    
import { IClient } from '../interfaces/clients.interface';
import Client from '../models/clients.models';

export const getClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const clients = await Client.findAll({
            attributes: { exclude: ['is_deleted'] }, // Exclude soft delete flag from response
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: clients,
            count: clients.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener clientes',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getClientById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id, {
            attributes: { exclude: ['is_deleted'] }
        });

        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            data: client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el cliente',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const createClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const clientData = req.body;
        
        // Validate required fields
        if (!clientData.business_name || !clientData.delivery_address || 
            !clientData.phone || !clientData.email) {
            res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: business_name, delivery_address, phone, email'
            });
            return;
        }

        const newClient = await Client.create(clientData);

        res.status(201).json({
            success: true,
            message: 'Cliente creado correctamente',
            data: newClient
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error al crear el cliente',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
};

export const updateClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const clientData = req.body;
        const client = await Client.findByPk(id);

        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
            return;
        }

        await client.update(clientData);
        res.status(200).json({
            success: true,
            message: 'Cliente actualizado correctamente',
            data: client
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({
                success: false,
                message: 'El email ya está registrado por otro cliente'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el cliente',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
};

// Soft delete client
export const deleteClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id);

        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
            return;
        }

        await client.update({ is_deleted: true });
        res.status(200).json({
            success: true,
            message: 'Cliente eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el cliente',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

