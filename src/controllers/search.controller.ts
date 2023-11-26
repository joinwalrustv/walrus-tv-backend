import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { decodeHtmlEntity, formatTimestamp } from "../utils/stringHelpers";

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
    console.log("[getYoutubeSearchResults] Error");
    console.log(err);
    return res.status(403).send({ message: "Error" });
  }
};

export const getSoundcloudSearchResults = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query.q;

  if (!query)
    return res.status(400).send({ message: "Invalid query." });

  try {
    const response = await axios
      .get("https://api-v2.soundcloud.com/search", {
        params: {
          q: query,
          variant_ids: "",
          facet: "model",
          filter: "streamable",
          user_id: "222220-277244-300843-587513",
          client_id: process.env.SOUNDCLOUD_API_KEY,
          limit: 20,
          offset: 0,
          linked_partitioning: 1,
          app_version: 1700828706,
          app_locale: "en"
        }
      });
    
      const soundcloudResults = [];
      const collection = response.data.collection;

      for (const song of collection) {
        if (!song.title || !song.artwork_url || !song.permalink_url || !song.full_duration) continue;

        const title = song.title;
        const thumbnail = song.artwork_url.replace("large.jpg", "t500x500.jpg");
        const link = song.permalink_url;
        const timestamp = formatTimestamp(song.full_duration);

        soundcloudResults.push({
          title: title,
          thumbnail: thumbnail,
          link: link,
          timestamp: timestamp
        });
      }

      return res.send({ message: "Success.", contents: soundcloudResults });
  } catch (err) {
    console.log("[getSoundcloudSearchResults] Error");
    console.log(err);
    return res.status(403).send({ message: "The SoundCloud search quota has exeeded the limit. Please try again later." });
  }
};
