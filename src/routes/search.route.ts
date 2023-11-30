import express from "express";
import {
  getSoundcloudSearchResults,
  getTwitchSearchResults,
  getVimeoSearchResults,
  getYoutubeSearchResults
} from "../controllers/search.controller";

const router = express.Router();

router.get("/youtube", getYoutubeSearchResults);
router.get("/soundcloud", getSoundcloudSearchResults);
router.get("/vimeo", getVimeoSearchResults);
router.get("/twitch", getTwitchSearchResults);

export default router;
