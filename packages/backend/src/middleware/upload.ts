import multer from 'multer';
import { Request } from 'express';

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();

// Filtro para validar que solo se suban imágenes
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Verificar que el archivo sea una imagen
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('El archivo debe ser una imagen (jpg, jpeg, png, gif, webp)'));
    }
};

// Configuración de multer
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Límite de 5MB
    },
});

// Middleware para manejar errores de multer
export const handleMulterError = (error: any, req: Request, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'El archivo es demasiado grande. Máximo 5MB permitido.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Campo de archivo inesperado.'
            });
        }
    }
    
    if (error.message.includes('imagen')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    next(error);
};
