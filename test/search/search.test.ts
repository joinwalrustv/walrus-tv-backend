import chai, { expect } from "chai";
import sinon from "sinon";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getSoundcloudSearchResults, getTwitchSearchResults, getVimeoSearchResults, getYoutubeSearchResults } from "../../src/controllers/search.controller";
import { Request, Response, NextFunction } from "express";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

describe("Search", () => {
  describe("getYoutubeSearchResults", () => {
    let mock: MockAdapter;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    const fakeData = {
      items: [
        {
          snippet: {
            title: "Video Title",
            thumbnails: {
              medium: {
                url: "thumbnail_url"
              }
            }
          },
          id: {
            videoId: "videoId"
          }
        }
      ]
    };
  
    beforeEach(() => {
      mock = new MockAdapter(axios);
      req = {
        query: { q: "test" }
      };
      res = {
        status: sinon.stub().returnsThis(),
        send: sinon.spy()
      };
      next = sinon.spy();
    });
  
    it("should return 400 if query is not provided", async () => {
      req.query = {};
      await getYoutubeSearchResults(req as Request, res as Response, next);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.send).to.have.been.calledWith({ message: "Invalid query." });
    });
  
    it("should return search results if query is provided", async () => {
      mock.onGet("https://www.googleapis.com/youtube/v3/search").reply(200, fakeData);
  
      await getYoutubeSearchResults(req as Request, res as Response, next);
  
      expect(res.send).to.have.been.calledWith({
        message: "Success.",
        contents: [
          {
            title: "Video Title",
            link: "https://www.youtube.com/watch?v=videoId",
            thumbnail: "thumbnail_url"
          }
        ]
      });
    });
  
    it("should return 403 on axios error", async () => {
      mock.onGet("https://www.googleapis.com/youtube/v3/search").networkError();
  
      await getYoutubeSearchResults(req as Request, res as Response, next);
  
      expect(res.status).to.have.been.calledWith(403);
      expect(res.send).to.have.been.calledWith({ message: "Error" });
    });
  });

  describe("getSoundcloudSearchResults", () => {
    let mock: MockAdapter;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    const fakeData = {
      collection: [
        {
          title: "Song Title",
          artwork_url: "http://example.com/large.jpg",
          permalink_url: "http://example.com/song",
          full_duration: 120000
        }
      ]
    };
  
    beforeEach(() => {
      mock = new MockAdapter(axios);
      req = {
        query: { q: "test" }
      };
      res = {
        status: sinon.stub().returnsThis(),
        send: sinon.spy()
      };
      next = sinon.spy();
    });
  
    it("should return 400 if query is not provided", async () => {
      req.query = {};
      await getSoundcloudSearchResults(req as Request, res as Response, next);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.send).to.have.been.calledWith({ message: "Invalid query." });
    });
  
    it("should return search results if query is provided", async () => {
      mock.onGet("https://api-v2.soundcloud.com/search").reply(200, fakeData);
  
      await getSoundcloudSearchResults(req as Request, res as Response, next);
  
      expect(res.send).to.have.been.calledWith({
        message: "Success.",
        contents: [
          {
            title: "Song Title",
            thumbnail: "http://example.com/t500x500.jpg",
            link: "http://example.com/song",
            timestamp: "2:00"
          }
        ]
      });
    });

    it("should skip songs with missing required fields", async () => {
      const incompleteData = {
        collection: [
          {
            permalink_url: "http://example.com/song",
            full_duration: 120000
          },
          {
            title: "Complete Song",
            artwork_url: "http://example.com/complete_large.jpg",
            permalink_url: "http://example.com/complete_song",
            full_duration: 150000
          }
        ]
      };
    
      mock.onGet("https://api-v2.soundcloud.com/search").reply(200, incompleteData);
    
      await getSoundcloudSearchResults(req as Request, res as Response, next);
    
      expect(res.send).to.have.been.calledWith({
        message: "Success.",
        contents: [
          {
            title: "Complete Song",
            thumbnail: "http://example.com/complete_t500x500.jpg",
            link: "http://example.com/complete_song",
            timestamp: "2:30"
          }
        ]
      });
    });
    
  
    it("should return 403 on axios error", async () => {
      mock.onGet("https://api-v2.soundcloud.com/search").networkError();
  
      await getSoundcloudSearchResults(req as Request, res as Response, next);
  
      expect(res.status).to.have.been.calledWith(403);
      expect(res.send).to.have.been.calledWith({ message: "The SoundCloud search quota has exeeded the limit. Please try again later." });
    });
  });

  describe("getVimeoSearchResults", () => {
    let mock: MockAdapter;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    const fakeData = {
      data: [
        {
          name: "Video Title",
          pictures: {
            sizes: [{}, {}, {}, { link: "http://example.com/thumbnail.jpg" }]
          },
          uri: "/videos/123456",
          duration: 120
        }
      ]
    };

    beforeEach(() => {
      mock = new MockAdapter(axios);
      req = {
        query: { q: "test" }
      };
      res = {
        status: sinon.stub().returnsThis(),
        send: sinon.spy()
      };
      next = sinon.spy();
    });

    it("should return 400 if query is not provided", async () => {
      req.query = {};
      await getVimeoSearchResults(req as Request, res as Response, next);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.send).to.have.been.calledWith({ message: "Invalid query." });
    });

    it("should return search results if query is provided", async () => {
      mock.onGet("https://api.vimeo.com/videos").reply(200, fakeData);

      await getVimeoSearchResults(req as Request, res as Response, next);

      expect(res.send).to.have.been.calledWith({
        message: "Success.",
        contents: [
          {
            title: "Video Title",
            thumbnail: "http://example.com/thumbnail.jpg",
            link: "https://vimeo.com/123456",
            timestamp: "2:00"
          }
        ]
      });
    });

    it("should return 403 on axios error", async () => {
      mock.onGet("https://api.vimeo.com/videos").networkError();

      await getVimeoSearchResults(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(403);
      expect(res.send).to.have.been.calledWith({ message: "The Vimeo search quota has exeeded the limit. Please try again later." });
    });
  });

  describe("getTwitchSearchResults", () => {
    let mock: MockAdapter;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    const tokenResponseData = {
      access_token: 'testToken',
    };
    const fakeTwitchData = {
      data: [
        {
          title: "Channel Title",
          broadcaster_login: "channelname",
          thumbnail_url: "http://example.com/thumbnail.jpg",
        }
      ]
    };

    beforeEach(() => {
      mock = new MockAdapter(axios);
      req = {
        query: { q: "test" }
      };
      res = {
        status: sinon.stub().returnsThis(),
        send: sinon.spy()
      };
      next = sinon.spy();

      process.env.TWITCH_CLIENT_ID = 'testClientId';
      process.env.TWITCH_CLIENT_SECRET = 'testClientSecret';
    });

    afterEach(() => {
      delete process.env.TWITCH_CLIENT_ID;
      delete process.env.TWITCH_CLIENT_SECRET;
    });

    it("should return 400 if query is not provided", async () => {
      req.query = {};
      await getTwitchSearchResults(req as Request, res as Response, next);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.send).to.have.been.calledWith({ message: "Invalid query." });
    });

    it("should return search results if query is provided", async () => {
      mock.onPost("https://id.twitch.tv/oauth2/token").reply(200, tokenResponseData);
      mock.onGet("https://api.twitch.tv/helix/search/channels?query=test&live_only=true").reply(200, fakeTwitchData);

      await getTwitchSearchResults(req as Request, res as Response, next);

      expect(res.send).to.have.been.calledWith({
        message: "Success.",
        contents: [
          {
            title: "Channel Title",
            thumbnail: "http://example.com/thumbnail.jpg",
            link: "https://twitch.tv/channelname"
          }
        ]
      });
    });

    it("should return 403 on axios error", async () => {
      mock.onPost("https://id.twitch.tv/oauth2/token").networkError();

      await getTwitchSearchResults(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(403);
      expect(res.send).to.have.been.calledWith({ message: "The Twitch search quota has exeeded the limit. Please try again later." });
    });
  });
});
