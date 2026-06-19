process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../server.js";

describe("apartments API", () => {
  it("lists apartments", async () => {
    const res = await request(app).get("/api/apartments");
    expect(res.status).toBe(200);
  });

  it("blocks an unauthenticated review", async () => {
    const res = await request(app)
      .post("/api/apartments/1/reviews")
      .send({ rating: 5, body: "Nice" });
    expect(res.status).toBe(401);
  });
});