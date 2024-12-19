import { Router } from "express";
import { getClient, getClientById, createClient, updateClient, deleteClient } from "../controllers/clients.controller.js";

const router = Router();

router.get('/Client', getClient);   

router.get('/Client/:id', getClientById);

router.post('/Client', createClient);

router.put('/Client/:id', updateClient);

router.delete('/Client/:id', deleteClient);

export default router;