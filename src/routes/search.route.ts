import express from "express";
import { getYoutubeSearchResults } from "../controllers/search.controller";

const router = express.Router();

router.get("/youtube", getYoutubeSearchResults);

export default router;
