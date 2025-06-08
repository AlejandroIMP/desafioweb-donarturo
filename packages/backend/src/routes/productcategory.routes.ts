import { Router } from "express";
import { getProductcategory, getProductCategoryById, createProductCategory, updateProductCategory, updateProductCategoryState, deleteProductCategory } from "../controllers/productcategory.controller";
import { verifyToken, verifyRol } from "../middleware/auth";
import { ROLES } from "../config/roles";

const router = Router();

router.get('/productCategory', verifyToken, verifyRol([ROLES.ADMIN, ROLES.USER, ROLES.CLIENTE]), getProductcategory);   

router.get('/productCategory/:id', verifyToken, verifyRol([ROLES.ADMIN, ROLES.USER, ROLES.CLIENTE]), getProductCategoryById);

router.post('/productCategory', verifyToken, verifyRol([ROLES.ADMIN]), createProductCategory);

router.put('/productCategory/:id', verifyToken, verifyRol([ROLES.ADMIN]), updateProductCategory);

router.patch('/productCategory/:id', verifyToken, verifyRol([ROLES.ADMIN]), updateProductCategoryState);

router.delete('/productCategory/:id', verifyToken, verifyRol([ROLES.ADMIN]), deleteProductCategory);

export default router;