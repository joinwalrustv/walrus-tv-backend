import chai, { expect } from "chai";
import sinon from "sinon";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getYoutubeSearchResults } from "../../src/controllers/search.controller";
import { Request, Response, NextFunction } from "express";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

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
