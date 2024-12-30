import { Router } from "express";
import { getState, getStateById, createState, updateState } from "../controllers/state.controller";
import { verifyToken, verifyRol } from "../middleware/auth"
import { ROLES } from "../config/roles";

const router = Router();

router.get('/estados', verifyToken, verifyRol([ROLES.ADMIN]), getState);   

router.get('/estados/:id', verifyToken, verifyRol([ROLES.ADMIN]), getStateById);

router.post('/estados', verifyToken, verifyRol([ROLES.ADMIN]), createState);

router.put('/estados/:id', verifyToken, verifyRol([ROLES.ADMIN]), updateState);

export default router;