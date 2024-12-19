import { Router } from "express";
import { getProductcategory, getProductCategoryById, createProductCategory, updateProductCategory, deleteProductCategory } from "../controllers/productcategory.controller.js";

const router = Router();

router.get('/productCategory', getProductcategory);   

router.get('/productCategory/:id', getProductCategoryById);

router.post('/productCategory', createProductCategory);

router.put('/productCategory/:id', updateProductCategory);

router.delete('/productCategory/:id', deleteProductCategory);

export default router;