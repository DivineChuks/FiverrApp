import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { createGig, deleteGig, getGig, getGigs } from "../controllers/gig.js";

const router = express.Router();

router.post("/", verifyToken, createGig);
router.get("/", getGigs);
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", getGig);

export default router;
