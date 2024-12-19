import { Router } from "express";
import { getState, getStateById, createState, updateState, deleteState } from "../controllers/state.controller.js";

const router = Router();

router.get('/estados', getState);   

router.get('/estados/:id', getStateById);

router.post('/estados', createState);

router.put('/estados/:id', updateState);

router.delete('/estados/:id', deleteState);

export default router;