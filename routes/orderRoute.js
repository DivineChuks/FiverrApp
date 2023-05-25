import express from "express";
import { getOrders, intent } from "../controllers/order.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/create-payment-intent/:id", verifyToken, intent);

router.get("/", verifyToken, getOrders);

export default router;
