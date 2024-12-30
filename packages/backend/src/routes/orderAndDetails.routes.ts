import { Router } from "express";
import { getOrder, getOrderById, createOrder, updateOrder, updateOrderState } from "../controllers/orderAndDetails.controller";
import { verifyToken, verifyRol } from "../middleware/auth";
import { validateOrder } from "../middleware/validateOrder";
import { ROLES } from "../config/roles";

const router = Router();

router.get('/order', verifyToken, verifyRol([ROLES.ADMIN, ROLES.USER, ROLES.CLIENTE]), getOrder);   

router.get('/order/:id', verifyToken, verifyRol([ROLES.ADMIN, ROLES.USER, ROLES.CLIENTE]), getOrderById);

router.post('/order', verifyToken, verifyRol([ROLES.ADMIN, ROLES.USER, ROLES.CLIENTE]), validateOrder, createOrder);

router.put('/order/:id', verifyToken, verifyRol([ROLES.ADMIN]), updateOrder);

router.patch('/order/:id', verifyToken, verifyRol([ROLES.ADMIN]), updateOrderState);

export default router;