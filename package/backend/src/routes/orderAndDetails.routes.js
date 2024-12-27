import { Router } from "express";
import { getOrder, getOrderById, createOrder, updateOrder, updateOrderState } from "../controllers/orderAndDetails.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { validateOrder } from "../middleware/validateOrder.js";

const router = Router();

router.get('/order', verifyToken, getOrder);   

router.get('/order/:id', verifyToken, getOrderById);

router.post('/order', verifyToken, validateOrder, createOrder);

router.put('/order/:id', verifyToken, updateOrder);

router.patch('/order/:id', verifyToken, updateOrderState);

export default router;