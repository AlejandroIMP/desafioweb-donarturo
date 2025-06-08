import { Request, Response, NextFunction } from 'express';
import { IProduct } from '../interfaces/product.interface';
import { ImageUploadService } from '../services/imageUpload.service';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ResponseHelper } from '../helpers/responseHelper';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../enums/errorMessages';

import { Product, ProductCategory, User, State } from '../models/index.models';

export const getProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const products = await Product.findAll({
        attributes: { exclude: ['is_deleted'] },
        order: [['created_at', 'DESC']]
    });
    
    ResponseHelper.success(res, products, SUCCESS_MESSAGES.RETRIEVED, 200, { count: products.length });
});

export const getProductsByAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const products = await Product.findAll({
        attributes: {
            exclude: ['category_id', 'user_id', 'state_id', 'is_deleted']
        },
        include: [
            {
                model: ProductCategory,
                as: 'category',
                attributes: ['category_name', 'category_id']
            },
            {
                model: User,
                as: 'user',
                attributes: ['full_name', 'user_id']
            },
            {
                model: State,
                as: 'state',
                attributes: ['state_name', 'state_id']
            }
        ],
        order: [['created_at', 'DESC']]
    });

    ResponseHelper.success(res, products, SUCCESS_MESSAGES.RETRIEVED, 200, { count: products.length });
});   

export const getProductById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
        throw new AppError(ERROR_MESSAGES.VALIDATION.INVALID_ID, 400);
    }
    
    const product = await Product.findByPk(id, {
        attributes: { exclude: ['is_deleted'] }
    });

    if (!product) {
        throw new AppError(ERROR_MESSAGES.PRODUCT.NOT_FOUND, 404);
    }
    
    ResponseHelper.success(res, product);
});

export const createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const productData = req.body;
    
    // Validate required fields
    if (!productData.category_id || !productData.user_id || !productData.state_id ||
        !productData.product_name || !productData.brand || !productData.product_code ||
        !productData.stock_quantity || !productData.unit_price) {
        throw new AppError(ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS, 400);
    }
    
    // Validar que el precio sea positivo
    if (Number(productData.unit_price) <= 0) {
        throw new AppError(ERROR_MESSAGES.PRODUCT.INVALID_PRICE, 400);
    }
    
    // Validar que el stock sea no negativo
    if (Number(productData.stock_quantity) < 0) {
        throw new AppError(ERROR_MESSAGES.PRODUCT.INVALID_STOCK, 400);
    }

    const newProduct = await Product.create(productData);
    
    ResponseHelper.created(res, newProduct, 'Producto creado correctamente');
});

export const updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const productData: Partial<IProduct> = req.body;

    if (!id || isNaN(Number(id))) {
        throw new AppError(ERROR_MESSAGES.VALIDATION.INVALID_ID, 400);
    }

    const product = await Product.findByPk(id);

    if (!product) {
        throw new AppError(ERROR_MESSAGES.PRODUCT.NOT_FOUND, 404);
    }
    
    // Validar precio si está presente en la actualización
    if (productData.unit_price && Number(productData.unit_price) <= 0) {
        throw new AppError(ERROR_MESSAGES.PRODUCT.INVALID_PRICE, 400);
    }
    
    // Validar stock si está presente en la actualización
    if (productData.stock_quantity !== undefined && Number(productData.stock_quantity) < 0) {
        throw new AppError(ERROR_MESSAGES.PRODUCT.INVALID_STOCK, 400);
    }

    await product.update(productData);

    ResponseHelper.success(res, product, SUCCESS_MESSAGES.UPDATED);
});

export const updateProductState = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { state_id } = req.body;

    if (!id || isNaN(Number(id))) {
        throw new AppError(ERROR_MESSAGES.VALIDATION.INVALID_ID, 400);
    }

    if (!state_id || isNaN(Number(state_id))) {
        throw new AppError('El ID de estado es requerido y debe ser un número', 400);
    }

    const product = await Product.findByPk(id);

    if (!product) {
        throw new AppError(ERROR_MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    await product.update({ state_id });

    ResponseHelper.success(res, null, 'Estado del producto actualizado correctamente');
});

// Soft delete product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
            return;
        }

        await product.update({ is_deleted: true });
        res.status(200).json({
            success: true,
            message: 'Producto eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el producto',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Create product with image upload
export const createProductWithImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productData = req.body;
        const file = req.file;
        
        // Validate required fields
        if (!productData.category_id || !productData.user_id || !productData.state_id ||
            !productData.product_name || !productData.brand || !productData.product_code ||
            !productData.stock_quantity || !productData.unit_price) {
            res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
            });
            return;
        }

        let imageUrl = null;
        let imagePublicId = null;

        // If an image is uploaded, upload it to Cloudinary
        if (file) {
            const uploadResult = await ImageUploadService.uploadImage(
                file.buffer,
                'products',
                `product_${productData.product_code}_${Date.now()}`
            );

            if (!uploadResult.success) {
                res.status(400).json({
                    success: false,
                    message: `Error al subir la imagen: ${uploadResult.error}`
                });
                return;
            }

            imageUrl = uploadResult.url;
            imagePublicId = uploadResult.publicId;
        }

        // Add image URL to product data
        const productDataWithImage = {
            ...productData,
            image_url: imageUrl,
            cloudinary_public_id: imagePublicId // Para poder eliminar la imagen después si es necesario
        };

        const newProduct = await Product.create(productDataWithImage);

        res.status(201).json({
            success: true,
            message: 'Producto creado correctamente',
            data: newProduct
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({
                success: false,
                message: 'El código de producto ya existe'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error al crear el producto',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
};

// Update product with optional image upload
export const updateProductWithImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const productData: Partial<IProduct> = req.body;
        const file = req.file;

        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
            return;
        }

        let imageUrl = productData.image_url;
        let imagePublicId = null;

        // If a new image is uploaded, upload it to Cloudinary
        if (file) {
            const uploadResult = await ImageUploadService.uploadImage(
                file.buffer,
                'products',
                `product_${productData.product_code || product.product_code}_${Date.now()}`
            );

            if (!uploadResult.success) {
                res.status(400).json({
                    success: false,
                    message: `Error al subir la imagen: ${uploadResult.error}`
                });
                return;
            }

            imageUrl = uploadResult.url;
            imagePublicId = uploadResult.publicId;

            // Optionally delete old image from Cloudinary if it exists
            if (product.cloudinary_public_id) {
                await ImageUploadService.deleteImage(product.cloudinary_public_id);
            }
        }

        // Update product data with new image URL
        const updateData = {
            ...productData,
            image_url: imageUrl,
            ...(imagePublicId && { cloudinary_public_id: imagePublicId })
        };

        await product.update(updateData);

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

// Upload image only endpoint
export const uploadProductImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const file = req.file;

    if (!id || isNaN(Number(id))) {
        throw new AppError(ERROR_MESSAGES.VALIDATION.INVALID_ID, 400);
    }

    if (!file) {
        throw new AppError(ERROR_MESSAGES.FILE.NO_FILE, 400);
    }

    const product = await Product.findByPk(id);

    if (!product) {
        throw new AppError(ERROR_MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    const uploadResult = await ImageUploadService.uploadImage(
        file.buffer,
        'products',
        `product_${product.product_code}_${Date.now()}`
    );

    if (!uploadResult.success) {
        throw new AppError(
            `${ERROR_MESSAGES.PRODUCT.IMAGE_UPLOAD_FAILED}: ${uploadResult.error}`,
            400
        );
    }

    // Delete old image if it exists
    if (product.cloudinary_public_id) {
        await ImageUploadService.deleteImage(product.cloudinary_public_id);
    }

    // Update product with new image URL
    await product.update({
        image_url: uploadResult.url,
        cloudinary_public_id: uploadResult.publicId
    });

    ResponseHelper.success(res, {
        image_url: uploadResult.url,
        public_id: uploadResult.publicId
    }, 'Imagen subida correctamente');
});