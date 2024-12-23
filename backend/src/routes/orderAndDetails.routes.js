import { Router } from "express";
import { getOrder, getOrderById, createOrder, updateOrder, deleteOrder } from "../controllers/orderAndDetails.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { validateOrder } from "../middleware/validateOrder.js";

const router = Router();

router.get('/order', verifyToken, getOrder);   

router.get('/order/:id', verifyToken, getOrderById);

router.post('/order', verifyToken, validateOrder, createOrder);

router.put('/order/:id', verifyToken, updateOrder);

router.delete('/order/:id', verifyToken, deleteOrder);

export default router;