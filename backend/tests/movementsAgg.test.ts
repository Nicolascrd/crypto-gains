import request from "supertest";
import app from "./../src/app";
import { assert } from "chai";

const failingParamsToTest1 = {
  ids: [1, 3],
  start: 0,
  end: 1677768710,
  crypto: true,
};
const failingParamsToTest2 = {
  ids: [],
  start: 1500000000,
  end: 1677768710,
  crypto: true,
};
const failingParamsToTest3 = {
  ids: [1, 3],
  start: 1700000000,
  end: 1677768710,
  crypto: true,
};
const paramsToTest = {
  ids: [1, 3],
  start: 1500000000,
  end: 1677768710,
  crypto: true,
};

describe("POST /movementsAgg", () => {
  it("should return code 400", async () => {
    await request(app)
      .post("/movementsAgg")
      .send(failingParamsToTest1)
      .expect(400);
  });
  it("should return code 400", async () => {
    await request(app)
      .post("/movementsAgg")
      .send(failingParamsToTest2)
      .expect(400);
  });
  it("should return code 400", async () => {
    await request(app)
      .post("/movementsAgg")
      .send(failingParamsToTest3)
      .expect(400);
  });
  it("should return code 200", async () => {
    await request(app).post("/movementsAgg").send(paramsToTest).expect(200);
  });
  it("should return a Record<string, {+/-}>", async () => {
    await request(app)
      .post("/movementsAgg")
      .set("Accept", "application/json")
      .send(paramsToTest)
      .then((response) => {
        const responseBody = response.body;
        for (let i = 0; i < responseBody.length; i++) {
          for (const ticker in responseBody[i]) {
            assert(
              "+" in responseBody[i][ticker] && "-" in responseBody[i][ticker],
              "if ticker is present, +/- prop should be available"
            );
            assert(
              responseBody[i][ticker]["+"] >= 0 &&
                responseBody[i][ticker]["-"] <= 0,
              "change - should be negative, change + should be positive"
            );
          }
        }
      });
  });
});
