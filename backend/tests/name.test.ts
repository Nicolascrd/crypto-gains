import { assert } from "chai";
import request from "supertest";
import app from "./../src/app";

describe("GET /name", () => {
  it("should return code 200 for id = 1", async () => {
    await request(app).get("/name?id=1").expect(200);
  });

  it("should return a string of length >= 1 as result for id = 1", async () => {
    await request(app)
      .get("/name?id=1")
      .set("Accept", "text/plain")
      .then((response) => {
        assert(response.text, "response.text is no truthy");
        assert(response.text.length >= 1, "response.text length < 1");
      });
  });
});
