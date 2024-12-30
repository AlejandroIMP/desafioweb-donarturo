import { Request, Response, NextFunction } from 'express';
import State from '../models/state.models';
import { IState } from '../interfaces/state.interface';

export const getState = async (req: Request, res: Response): Promise<void> => {
    try {
        const states = await State.findAll();

        res.status(200).json({
            success: true,
            data: states,
            count: states.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estados',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getStateById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const state = await State.findByPk(id);

        if (!state) {
            res.status(404).json({
                success: false,
                message: 'Estado no encontrado'
            });

        }
        res.status(200).json({
            success: true,
            data: state
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el estado',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const createState = async (req: Request, res: Response): Promise<void> => {
    try {
        const stateData: IState = req.body;
        const newState = await State.create(stateData);

        res.status(201).json({
            success: true,
            message: 'Estado creado correctamente',
            data: newState
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el estado',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateState = async (req: Request, res: Response): Promise<void> => {
    try{
        const { id } = req.params;
        const stateData: IState = req.body;
        const state = await State.findByPk(id);

        if (!state) {
            res.status(404).json({
                success: false,
                message: 'Estado no encontrado'
            });
        } else {
            await state.update(stateData);
            res.status(200).json({
                success: true,
                message: 'Estado actualizado correctamente',
                data: state
            });
        }
    } catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el estado',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
