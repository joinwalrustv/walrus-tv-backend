import express from "express";
import {
  getSoundcloudSearchResults,
  getVimeoSearchResults,
  getYoutubeSearchResults
} from "../controllers/search.controller";

const router = express.Router();

router.get("/youtube", getYoutubeSearchResults);
router.get("/soundcloud", getSoundcloudSearchResults);
router.get("/vimeo", getVimeoSearchResults);

export default router;
