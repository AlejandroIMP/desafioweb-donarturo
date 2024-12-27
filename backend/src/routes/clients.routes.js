import { Router } from "express";
import { getClient, getClientById, createClient, updateClient } from "../controllers/clients.controller.js";

const router = Router();

router.get('/client', verifyToken, getClient);   

router.get('/client/:id', verifyToken, getClientById);

router.post('/client', verifyToken, createClient);

router.put('/client/:id', verifyToken, updateClient);

// router.patch('/client/:id', updateClientState);

export default router;