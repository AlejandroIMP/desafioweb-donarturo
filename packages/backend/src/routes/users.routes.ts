import { Router } from "express";
import { getUser, getUserById, updateUser, updateUserState } from "../controllers/users.controller";
import { verifyToken, verifyRol } from "../middleware/auth";
import { ROLES } from '../config/roles';

const router = Router();

router.get('/usuarios', verifyToken, verifyRol([ROLES.ADMIN]), getUser);   

router.get('/usuarios/:id', verifyToken, verifyRol([ROLES.ADMIN]), getUserById);

// router.post('/Usuarios', verifyToken, verifyRol([ROLES.ADMIN]), createUser);

router.put('/usuarios/:id', verifyToken, verifyRol([ROLES.ADMIN]), updateUser);

router.patch('/usuarios/:id', verifyToken, verifyRol([ROLES.ADMIN]), updateUserState);

export default router;