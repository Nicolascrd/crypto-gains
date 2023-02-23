import { assert } from "chai";
import request from "supertest";
import app from "./../src/app";

describe("POST /prices , bad query", () => {
  it("should return code 400 with empty object", async () => {
    await request(app).post("/prices").send({}).expect(400);
  });
  it("should return code 400 with empty array", async () => {
    await request(app).post("/prices").send([]).expect(400);
  });
});

const arrayOfTickers = ["BTC", "ETH", "AVAX", "EWT"]; // EWT only with Kraken prices API

describe("POST /prices, valid query", () => {
  it("should return a object with prices", async function () {
    this.timeout(10000); // prices api can be slow

    await request(app)
      .post("/prices")
      .set("Accept", "application/json")
      .send(arrayOfTickers)
      .then((response) => {
        const bodyResponse = response.body;
        for (let i = arrayOfTickers.length - 1; i >= 0; i--) {
          assert(
            arrayOfTickers[i] in bodyResponse,
            "all indexes should correspond to given tickers"
          );
          arrayOfTickers.pop();
        }
        assert(
          arrayOfTickers.length === 0,
          "all prices should have been found"
        );
      });
  });
});
