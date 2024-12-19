import { Router } from "express";
import { getOrder, getOrderById, createOrder, updateOrder, deleteOrder } from "../controllers/orderAndDetails.controller.js";

const router = Router();

router.get('/order', getOrder);   

router.get('/order/:id', getOrderById);

router.post('/order', createOrder);

router.put('/order/:id', updateOrder);

router.delete('/order/:id', deleteOrder);

export default router;