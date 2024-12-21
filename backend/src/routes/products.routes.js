import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, updateProductState } from "../controllers/products.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.get('/productos', verifyToken, getProducts);
router.get('/productos/:id', verifyToken, getProductById);
router.post('/productos', verifyToken, createProduct);
router.put('/productos/:id', verifyToken, updateProduct);
router.patch('/productos/:id', verifyToken, updateProductState);
router.delete('/productos/:id', verifyToken, deleteProduct);

export default router;
