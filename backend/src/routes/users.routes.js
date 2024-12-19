import { Router } from "express";
import { getUser, getUserById, createUser, updateUser, deleteUser } from "../controllers/users.controller.js";

const router = Router();

router.get('/Usuarios', getUser);   

router.get('/Usuarios/:id', getUserById);

router.post('/Usuarios', createUser);

router.put('/Usuarios/:id', updateUser);

router.delete('/Usuarios/:id', deleteUser);

export default router;