import express from "express";
import { deleteUser, getUser } from "../controllers/user.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);

router.delete("/:id", verifyToken, deleteUser);

export default router;
