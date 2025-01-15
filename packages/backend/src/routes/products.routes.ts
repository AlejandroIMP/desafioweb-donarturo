import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, updateProductState, getProductsByAll } from "../controllers/products.controller";
import { verifyToken, verifyRol } from "../middleware/auth";
import { ROLES } from "../config/roles";

const router = Router();

router.get('/productos', verifyToken, verifyRol([ROLES.ADMIN, ROLES.USER, ROLES.CLIENTE]), getProductsByAll);

router.get('/productos/:id', verifyToken, verifyRol([ROLES.ADMIN, ROLES.USER, ROLES.CLIENTE]), getProductById);

router.post('/productos', verifyToken, verifyRol([ROLES.ADMIN]), createProduct);

router.put('/productos/:id', verifyToken, verifyRol([ROLES.ADMIN]), updateProduct);

router.patch('/productos/:id', verifyToken, verifyRol([ROLES.ADMIN]), updateProductState);


export default router;
