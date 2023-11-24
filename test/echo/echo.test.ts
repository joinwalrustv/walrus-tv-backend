import chai from "chai";
import chaiHttp from "chai-http";
import "mocha";
import server from "../../src/server";

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe("GET /echo", () => {
  it("should return \"Walrus TV\"", async () => {
      const res = await request(server).get("/echo")
      expect(res.body.message).to.equal("Walrus TV");
  });
});
