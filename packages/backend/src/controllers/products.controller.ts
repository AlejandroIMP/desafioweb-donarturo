import { Request, Response, NextFunction } from 'express';
import Product from '../models/products.models';
import { IProduct } from '../interfaces/product.interface';

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const products = await Product.findAll();
        res.status(200).json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        } 
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productData: IProduct = req.body;
        const newProduct = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: 'Producto creado correctamente',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const productData: Partial<IProduct> = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
            return;
        }

        await product.update(productData);

        res.status(200).json({
            success: true,
            message: 'Producto actualizado correctamente',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateProductState = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { estados_idestados } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
            return;
        }

        await product.update({ estados_idestados });

        res.status(200).json({
            success: true,
            message: 'Estado del producto actualizado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el estado del producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};