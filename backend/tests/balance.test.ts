import request from "supertest";
import app from "./../src/app";
import { assert } from "chai";

const idsToTest = [1, 3]

describe("POST /balance", () => {
  it("should return code 200", async () => {
    await request(app).post("/balance").send(idsToTest).expect(200);
  });
  it("should return an object balance", async () => {
    await request(app)
      .post("/balance")
      .send(idsToTest)
      .set("Accept", "application/json")
      .then((response) => {
        const bodyResponse = response.body;
        // might be too slow with lots of entries
        assert(
          "amounts" in bodyResponse,
          "amounts property not in bodyResponse"
        );
        assert(
          "tickers" in bodyResponse,
          "tickers property not in bodyResponse"
        );
        assert(
          Array.isArray(bodyResponse.tickers),
          "bodyResponse.tickers not an array"
        );
      });
  });
});
