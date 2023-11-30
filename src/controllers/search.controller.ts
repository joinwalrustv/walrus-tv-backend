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

export const getVimeoSearchResults = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query.q;

  if (!query)
    return res.status(400).send({ message: "Invalid query." });

  try {
    const response = await axios
      .get("https://api.vimeo.com/videos", {
        params: {
          query: query,
          access_token: process.env.VIMEO_API_KEY,
          page: 1,
          fields: "uri,name,duration,pictures",
          per_page: 15
        }
      });

      const vimeoResults = [];
      const videos = response.data.data;

      for (const video of videos) {
        const title = video.name;
        const thumbnail = video.pictures.sizes[3].link;
        const link = video.uri.replace("/videos/", "https://vimeo.com/");
        const timestamp = formatTimestamp(video.duration * 1000);

        vimeoResults.push({
          title: title,
          thumbnail: thumbnail,
          link: link,
          timestamp: timestamp
        });
      }

      return res.send({ message: "Success.", contents: vimeoResults });
  } catch (err) {
    console.log("[getVimeoSearchResults] Error");
    console.log(err);
    return res.status(403).send({ message: "The Vimeo search quota has exeeded the limit. Please try again later." });
  }
};

export const getTwitchSearchResults = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query.q;

  if (!query)
    return res.status(400).send({ message: "Invalid query." });

  try {
    const requestData = `client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`;
    const apiKeyResponse = await axios.post("https://id.twitch.tv/oauth2/token", requestData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const token = apiKeyResponse.data.access_token;

    const twitchResponse = await axios.get(`https://api.twitch.tv/helix/search/channels?query=${query}&live_only=true`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID
      }
    });

    const data = twitchResponse.data.data;
    const twitchResults = [];

    for (const channel of data) {
      twitchResults.push({
        title: channel.title,
        link: `https://twitch.tv/${channel.broadcaster_login}`,
        thumbnail: channel.thumbnail_url
      });
    }

    return res.status(200).send({ message: "Success.", contents: twitchResults });
  } catch (err) {
    console.log("[getTwitchSearchResults] Error");
    console.log(err);
    return res.status(403).send({ message: "The Twitch search quota has exeeded the limit. Please try again later." });
  }
};
