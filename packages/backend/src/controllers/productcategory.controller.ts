import { Request, Response, NextFunction } from 'express';
import ProductCategory from '../models/productcategory.models';
import { IProductCategory } from '../interfaces/productcategory.interface';

export const getProductcategory = async (req: Request, res: Response): Promise<void> => {
    try{
        const productcategory = await ProductCategory.findAll();
        res.status(200).json({
            success: true,
            data: productcategory,
            count: productcategory.length
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorias de productos',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
};

export const getProductCategoryById = async (req: Request, res: Response): Promise<void> => {
    try{
        const { id } = req.params;
        const productcategory = await ProductCategory.findByPk(id);

        if(!productcategory){
            res.status(404).json({
                success: false,
                message: 'Categoria de producto no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: productcategory
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al obtener la categoria de producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const createProductCategory = async(req: Request, res: Response): Promise<void> => {
    try{
        const productCategoryData: IProductCategory = req.body;
        const newProductCategory = await ProductCategory.create(productCategoryData);

        res.status(201).json({
            success: true,
            message: 'Categoria de producto creada correctamente',
            data: newProductCategory
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al crear la categoria de producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateProductCategory = async(req: Request, res: Response): Promise<void> => {
    try{
        const { id } = req.params;
        const productCategoryData: IProductCategory = req.body;
        const productCategory = await ProductCategory.findByPk(id);

        if(!productCategory){
            res.status(404).json({
                success: false,
                message: 'Categoria de producto no encontrada'
            });
        }

        await ProductCategory.update(productCategoryData, {
            where: { idCategoriaProductos: Number(id) }
        });

        res.status(200).json({
            success: true,
            message: 'Categoria de producto actualizada correctamente'
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la categoria de producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateProductCategoryState = async(req: Request, res: Response): Promise<void> => {
    try{
        const { id } = req.params;
        const productCategory = await ProductCategory.findByPk(id);

        if(!productCategory){
            res.status(404).json({
                success: false,
                message: 'Categoria de producto no encontrada'
            });
        }

        await ProductCategory.update({ estados_idestados: 2 }, {
            where: { idCategoriaProductos: Number(id) }
        });

        res.status(200).json({
            success: true,
            message: 'Categoria de producto eliminada correctamente'
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la categoria de producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};