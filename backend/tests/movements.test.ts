import request from "supertest";
import app from "./../src/app";
import { assert } from "chai";
import { Timeframe } from "../src/interfaces";

interface IMovementRequest {
  ids: number[];
  start: number;
  end: number;
  timeframe: Timeframe;
  crypto: boolean;
}

const failingParamsToTest1: IMovementRequest = {
  ids: [1, 3],
  start: 0,
  end: 1677768710,
  timeframe: "M",
  crypto: true,
};
const failingParamsToTest2: IMovementRequest = {
  ids: [],
  start: 1500000000,
  end: 1677768710,
  timeframe: "D",
  crypto: true,
};
const failingParamsToTest3 = {
  ids: [1, 3],
  start: 1700000000,
  end: 1677768710,
  crypto: true,
};
const paramsToTest: IMovementRequest = {
  ids: [1, 3],
  start: 1500000000,
  end: 1677768710,
  timeframe: "D",
  crypto: true,
};

describe("POST /movements", () => {
  it("should return code 400", async () => {
    await request(app)
      .post("/movements")
      .send(failingParamsToTest1)
      .expect(400);
  });
  it("should return code 400", async () => {
    await request(app)
      .post("/movements")
      .send(failingParamsToTest2)
      .expect(400);
  });
  it("should return code 400", async () => {
    await request(app)
      .post("/movements")
      .send(failingParamsToTest3)
      .expect(400);
  });
  it("should return code 200", async () => {
    await request(app).post("/movements").send(paramsToTest).expect(200);
  });
  it("should return an array of asset -> {+/-}", async () => {
    await request(app)
      .post("/movements")
      .set("Accept", "application/json")
      .send(paramsToTest)
      .then((response) => {
        const responseBody = response.body;
        assert(
          Array.isArray(responseBody) == true,
          "response body should be an array"
        );
        let prevEpoch = 0;
        for (let i = 0; i < responseBody.length; i++) {
          assert(
            "start" in responseBody[i] == true,
            "object should contain start"
          );
          assert(
            "assets" in responseBody[i] == true,
            "object should contain assets"
          );
          assert(
            responseBody[i]["start"] > prevEpoch,
            "epoch in start property should only go up"
          );
          prevEpoch = responseBody[i]["start"];
          for (const ticker in responseBody[i].assets) {
            assert(
              "+" in responseBody[i].assets[ticker] &&
                "-" in responseBody[i].assets[ticker],
              "if ticker is present, +/- prop should be available"
            );
          }
        }
      });
  });
});
