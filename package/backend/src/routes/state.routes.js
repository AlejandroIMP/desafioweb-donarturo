import { Router } from "express";
import { getState, getStateById, createState, updateState } from "../controllers/state.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.get('/estados', verifyToken, getState);   

router.get('/estados/:id', verifyToken, getStateById);

router.post('/estados', verifyToken, createState);

router.put('/estados/:id', verifyToken, updateState);

export default router;