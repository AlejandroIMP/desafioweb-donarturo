import { Router } from "express";
import { getClient, getClientById, createClient, updateClient } from "../controllers/clients.controller.js";

const router = Router();

router.get('/client', getClient);   

router.get('/client/:id', getClientById);

router.post('/client', createClient);

router.put('/client/:id', updateClient);

// router.patch('/client/:id', updateClientState);

export default router;