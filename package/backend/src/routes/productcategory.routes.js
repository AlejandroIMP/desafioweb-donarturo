import { Router } from "express";
import { getProductcategory, getProductCategoryById, createProductCategory, updateProductCategory, updateProductCategoryState } from "../controllers/productcategory.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.get('/productCategory', verifyToken, getProductcategory);   

router.get('/productCategory/:id', verifyToken, getProductCategoryById);

router.post('/productCategory', verifyToken, createProductCategory);

router.put('/productCategory/:id', verifyToken, updateProductCategory);

router.patch('/productCategory/:id', verifyToken, updateProductCategoryState);

export default router;