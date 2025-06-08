import { Request, Response, NextFunction } from 'express';
import ProductCategory from '../models/productcategory.models';
import { IProductCategory } from '../interfaces/productcategory.interface';

export const getProductcategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const productcategory = await ProductCategory.findAll({
            attributes: { exclude: ['is_deleted'] },
            order: [['created_at', 'DESC']]
        });
        res.status(200).json({
            success: true,
            data: productcategory,
            count: productcategory.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorias de productos',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
};

export const getProductCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const productcategory = await ProductCategory.findByPk(id, {
            attributes: { exclude: ['is_deleted'] }
        });

        if (!productcategory) {
            res.status(404).json({
                success: false,
                message: 'Categoria de producto no encontrada'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: productcategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la categoria de producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const createProductCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const productCategoryData = req.body;
        
        // Validate required fields
        if (!productCategoryData.user_id || !productCategoryData.state_id || 
            !productCategoryData.category_name) {
            res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: user_id, state_id, category_name'
            });
            return;
        }

        const newProductCategory = await ProductCategory.create(productCategoryData);

        res.status(201).json({
            success: true,
            message: 'Categoria de producto creada correctamente',
            data: newProductCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la categoria de producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateProductCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const productCategoryData = req.body;
        const productCategory = await ProductCategory.findByPk(id);

        if (!productCategory) {
            res.status(404).json({
                success: false,
                message: 'Categoria de producto no encontrada'
            });
            return;
        }

        await productCategory.update(productCategoryData);

        res.status(200).json({
            success: true,
            message: 'Categoria de producto actualizada correctamente',
            data: productCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la categoria de producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateProductCategoryState = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { state_id } = req.body;
        const productCategory = await ProductCategory.findByPk(id);

        if (!productCategory) {
            res.status(404).json({
                success: false,
                message: 'Categoria de producto no encontrada'
            });
            return;
        }

        await productCategory.update({ state_id });

        res.status(200).json({
            success: true,
            message: 'Estado de categoria de producto actualizado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el estado de la categoria de producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Soft delete product category
export const deleteProductCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const productCategory = await ProductCategory.findByPk(id);

        if (!productCategory) {
            res.status(404).json({
                success: false,
                message: 'Categoria de producto no encontrada'
            });
            return;
        }

        await productCategory.update({ is_deleted: true });

        res.status(200).json({
            success: true,
            message: 'Categoria de producto eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la categoria de producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};