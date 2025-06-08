import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, updateProductState, getProductsByAll, deleteProduct, createProductWithImage, updateProductWithImage, uploadProductImage } from "../controllers/products.controller";
import { verifyToken, verifyRol } from "../middleware/auth";
import { upload, handleMulterError } from "../middleware/upload";
import { ROLES } from "../config/roles";

const router = Router();

router.get('/productos', verifyToken, verifyRol([ROLES.ADMIN, ROLES.USER, ROLES.CLIENTE]), getProductsByAll);

router.get('/productos/:id', verifyToken, verifyRol([ROLES.ADMIN, ROLES.USER, ROLES.CLIENTE]), getProductById);

router.post('/productos', verifyToken, verifyRol([ROLES.ADMIN]), createProduct);

// New route for creating products with image upload
router.post('/productos/with-image', verifyToken, verifyRol([ROLES.ADMIN]), upload.single('image'), handleMulterError, createProductWithImage);

router.put('/productos/:id', verifyToken, verifyRol([ROLES.ADMIN]), updateProduct);

// New route for updating products with image upload
router.put('/productos/:id/with-image', verifyToken, verifyRol([ROLES.ADMIN]), upload.single('image'), handleMulterError, updateProductWithImage);

// New route for uploading product image only
router.post('/productos/:id/upload-image', verifyToken, verifyRol([ROLES.ADMIN]), upload.single('image'), handleMulterError, uploadProductImage);

router.patch('/productos/:id', verifyToken, verifyRol([ROLES.ADMIN]), updateProductState);

router.delete('/productos/:id', verifyToken, verifyRol([ROLES.ADMIN]), deleteProduct);

export default router;
