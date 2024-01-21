import express from "express";
import { createRoom } from "../controllers/rooms.controller";

const router = express.Router();

router.post("/", createRoom);

export default router;
