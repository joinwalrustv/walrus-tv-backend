import express from "express";
import { getSoundcloudSearchResults, getYoutubeSearchResults } from "../controllers/search.controller";

const router = express.Router();

router.get("/youtube", getYoutubeSearchResults);
router.get("/soundcloud", getSoundcloudSearchResults);

export default router;
