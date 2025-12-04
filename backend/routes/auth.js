import express from 'express';
import { createUser } from '../controllers/authController.js';
import { loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);

export default router;