import request from "supertest";
import app from "./../src/app";
import { assert } from "chai";

describe("POST /add_key , bad query", () => {
  it("should return code 400 with empty object", async () => {
    await request(app).post("/add_key").send({}).expect(400);
  });
  it("should return code 400 with empty strings", async () => {
    await request(app)
      .post("/add_key")
      .send({
        name: "",
        public_key: "",
        private_key: "",
        exchange: "",
      })
      .expect(400);
  });
  it("should return code 400 with wrong exchange strings", async () => {
    await request(app)
      .post("/add_key")
      .send({
        name: "My test key",
        public_key: "1234567890",
        secret_key: "Thisisnotasecretkey",
        exchange: "notKraken",
      })
      .expect(400);
  });
});

describe("POST /add_key, good query", () => {
  let keysCount = 0;
  before(async () => {
    keysCount = await countKeys();
  });
  it("should return code 200 when adding new key", async () => {
    await request(app)
      .post("/add_key")
      .send({
        name: "My test key",
        public_key: "1234567890",
        secret_key: "Thisisnotasecretkey",
        exchange: "Kraken",
      })
      .expect(200);
  });
  it("should have added one key to the db", async () => {
    await request(app)
      .get("/all_keys")
      .set("Accept", "application/json")
      .then((response) => {
        const bodyResponse = response.body;
        assert(
          bodyResponse.length === keysCount + 1,
          "exactly one key should have been added to the db"
        );
      });
  });
});

const countKeys = async () => {
  let ans = -1;
  await request(app)
    .get("/all_keys")
    .set("Accept", "application/json")
    .then((response) => {
      ans = response.body.length;
    });
  if (ans && ans >= 0) {
    return ans;
  }
  throw Error("could not count keys");
};
