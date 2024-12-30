import { Router } from "express";
import { getClient, getClientById, createClient, updateClient } from "../controllers/clients.controller";
import { verifyToken, verifyRol } from "../middleware/auth";
import { ROLES } from "../config/roles";

const router = Router();

router.get('/client', verifyToken, verifyRol([ROLES.ADMIN]), getClient);   

router.get('/client/:id', verifyToken, verifyRol([ROLES.ADMIN]), getClientById);

router.post('/client', verifyToken, verifyRol([ROLES.ADMIN]), createClient);

router.put('/client/:id', verifyToken, verifyRol([ROLES.ADMIN]), updateClient);

// router.patch('/client/:id', updateClientState);

export default router;