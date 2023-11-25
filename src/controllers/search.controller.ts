import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { decodeHtmlEntity } from "../utils/stringHelpers";

export const getYoutubeSearchResults = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query.q;

  if (!query)
    return res.status(400).send({ message: "Invalid query." });

  try {
    const response = await axios
      .get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet",
          maxResults: 15,
          q: query,
          type: "video",
          key: process.env.YOUTUBE_API_KEY
        }
      });

    const youtubeResults = [];
    const videos = response.data.items;

    for (const video of videos) {
      youtubeResults.push({
        title: decodeHtmlEntity(video.snippet.title),
        link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        thumbnail: video.snippet.thumbnails.medium.url
      });
    }

    return res.send({ message: "Success.", contents: youtubeResults });
  } catch (err) {
    return res.status(403).send({ message: "Error" });
  }
};
