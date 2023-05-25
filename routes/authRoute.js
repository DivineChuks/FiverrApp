import express from "express";
import { login, register } from "../controllers/auth.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

export default router;
