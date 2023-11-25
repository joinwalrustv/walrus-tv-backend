import chai from "chai";
import chaiHttp from "chai-http";
import "mocha";
import server from "../src/server";
import sinon from "sinon";
import http from "http";

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe("Server", () => {
  let listenStub: sinon.SinonStub;

  const loadServer = () => {
    delete require.cache[require.resolve("../src/server")];
    return require("../src/server");
  };

  beforeEach(() => {
      listenStub = sinon.stub(http.Server.prototype, "listen");
  });

  afterEach(() => {
      listenStub.restore();
  });

  it("should start on env port", () => {
      process.env.PORT = "5000";
      loadServer();

      expect(listenStub.calledWith("5000")).to.be.true;
  });

  it("should default to port 8000", () => {
      delete process.env.PORT;
      loadServer();

      expect(listenStub.calledWith(8000)).to.be.true;
  });
});

describe("GET /abcdef", () => {
  it("should not be found", async () => {
    const res = await request(server).get("/abcdef");
    expect(res.body.message).to.equal("not found");
    expect(res.status).to.equal(404);
  });

  it("should 200 when options", async () => {
    const res = await request(server).options("/abcdef");
    expect(res.status).to.equal(200);
  });
});
