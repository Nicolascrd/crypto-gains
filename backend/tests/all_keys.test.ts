import { assert } from "chai";
import request from "supertest";
import app from "./../src/app";

describe("GET /all_keys", () => {
  it("should return code 200", async () => {
    await request(app).get("/all_keys").expect(200);
  });
  it("should return an array of keys", async () => {
    await request(app)
      .get("/all_keys")
      .set("Accept", "application/json")
      .then((response) => {
        const bodyResponse = response.body;
        assert(Array.isArray(bodyResponse), "bodyResponse not an array");
        assert(bodyResponse.length >= 1, "bodyResponse length < 1");
        // might be too slow with lots of entries
        for (let i = 0; i < bodyResponse.length; i++) {
          assert(
            "key_id" in bodyResponse[i],
            `key_id not in bodyResponse[${i}]`
          );
          assert("name" in bodyResponse[i], `name not in bodyResponse[${i}]`);
          assert(
            "public_key" in bodyResponse[i],
            `public_key not in bodyResponse[${i}]`
          );
          assert(
            "exchange" in bodyResponse[i],
            `exchange not in bodyResponse[${i}]`
          );
          assert(
            ["Kraken", "Binance"].includes(bodyResponse[i].exchange),
            `bodyResponse[${i}].exchange is not Kraken or Binance`
          );
        }
      });
  });
});
