import chai from "chai";
import chaiHttp from "chai-http";
import "mocha";
import server from "../src/server";

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

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
