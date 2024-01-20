import express from "express";
import { createGuestUser, register } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.get("/guest-user", createGuestUser);

export default router;
