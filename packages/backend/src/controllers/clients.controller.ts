import { Request, Response } from 'express';    
import { IClient } from '../interfaces/clients.interface';
import Client from '../models/clients.models';

export const getClient = async (req:Request, res:Response): Promise<void> => {
    try{
        const clients = await Client.findAll();

        res.status(200).json({
            success: true,
            data: clients,
            count: clients.length
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al obtener clientes',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getClientById = async (req:Request, res:Response): Promise<void> => {
    try{
        const { id } = req.params;
        const client = await Client.findByPk(id);

        if(!client){
            res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            data: client
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al obtener el cliente',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const createClient = async (req:Request, res:Response): Promise<void> => {
    try{
        const clientData: IClient = req.body;
        const newClient = await Client.create(clientData);

        res.status(201).json({
            success: true,
            message: 'Cliente creado correctamente',
            data: newClient
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al crear el cliente',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateClient = async (req:Request, res:Response): Promise<void> => {
    try{
        const { id } = req.params;
        const clientData: IClient = req.body;
        const client = await Client.findByPk(id);

        if(!client){
            res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }else{
            await client.update(clientData);
            res.status(200).json({
                success: true,
                message: 'Cliente actualizado correctamente',
                data: client
            });
        }
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el cliente',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// export const updateClientState = async(req:Request, res:Response): Promise<void> => {
//     try{
//         const { id } = req.params;
//         const client = await Client.findByPk(id);

//         if(!client){
//             res.status(404).json({
//                 success: false,
//                 message: 'Cliente no encontrado'
//             });
//         }else{
//             await client.update({ estados_idestados: !client.state });
//             res.status(200).json({
//                 success: true,
//                 message: 'Estado del cliente actualizado correctamente',
//                 data: client
//             });
//         }
//     } catch(error){
//         res.status(500).json({
//             success: false,
//             message: 'Error al actualizar el estado del cliente',
//             error: error instanceof Error ? error.message : 'Unknown error'
//         });
//     }
// }

