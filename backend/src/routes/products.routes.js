import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, updateProductState } from "../controllers/products.controller.js";

const router = Router();

router.get('/productos', getProducts);   

router.get('/productos/:id', getProductById);

router.post('/productos', createProduct);

router.put('/productos/:id', updateProduct);

router.patch('/productos/:id', updateProductState);

router.delete('/productos/:id', deleteProduct);

export default router;