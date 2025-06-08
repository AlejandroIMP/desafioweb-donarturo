import { cloudinary } from '../config/cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export interface CloudinaryUploadResult {
    success: boolean;
    url?: string;
    publicId?: string;
    error?: string;
}

export class ImageUploadService {
    /**
     * Sube una imagen a Cloudinary desde un buffer
     * @param buffer Buffer de la imagen
     * @param folder Carpeta en Cloudinary donde se guardará la imagen
     * @param fileName Nombre personalizado para el archivo (opcional)
     * @returns Resultado de la subida con URL y public_id
     */
    static async uploadImage(
        buffer: Buffer, 
        folder: string = 'ecommerce', 
        fileName?: string
    ): Promise<CloudinaryUploadResult> {
        return new Promise((resolve) => {
            const uploadOptions: any = {
                folder: folder,
                resource_type: 'image',
                format: 'webp', // Convertir a WebP para mejor compresión
                quality: 'auto:good', // Optimización automática de calidad
                fetch_format: 'auto', // Formato automático según el navegador
            };

            // Si se proporciona un nombre de archivo, usarlo como public_id
            if (fileName) {
                uploadOptions.public_id = `${folder}/${fileName}`;
                uploadOptions.overwrite = true; // Permitir sobrescribir si existe
            }

            cloudinary.uploader.upload_stream(
                uploadOptions,
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error) {
                        console.error('Error uploading to Cloudinary:', error);
                        resolve({
                            success: false,
                            error: error.message || 'Error al subir la imagen'
                        });
                    } else if (result) {
                        resolve({
                            success: true,
                            url: result.secure_url,
                            publicId: result.public_id
                        });
                    } else {
                        resolve({
                            success: false,
                            error: 'No se recibió respuesta de Cloudinary'
                        });
                    }
                }
            ).end(buffer);
        });
    }

    /**
     * Elimina una imagen de Cloudinary
     * @param publicId ID público de la imagen en Cloudinary
     * @returns Resultado de la eliminación
     */
    static async deleteImage(publicId: string): Promise<CloudinaryUploadResult> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            
            if (result.result === 'ok') {
                return {
                    success: true
                };
            } else {
                return {
                    success: false,
                    error: 'No se pudo eliminar la imagen'
                };
            }
        } catch (error) {
            console.error('Error deleting from Cloudinary:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error al eliminar la imagen'
            };
        }
    }

    /**
     * Genera una URL optimizada para una imagen ya subida
     * @param publicId ID público de la imagen
     * @param transformations Transformaciones a aplicar (opcional)
     * @returns URL optimizada
     */
    static getOptimizedUrl(publicId: string, transformations?: any): string {
        const defaultTransformations = {
            quality: 'auto:good',
            fetch_format: 'auto'
        };

        const finalTransformations = transformations 
            ? { ...defaultTransformations, ...transformations }
            : defaultTransformations;

        return cloudinary.url(publicId, finalTransformations);
    }
}
