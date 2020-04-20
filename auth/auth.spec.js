const server = require("../api/server");
const request = require("supertest");

const db = require("../database/dbConfig");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");

describe("auth router", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  describe("POST /api/auth/register", () => {
    it("should return 400 if object is invalid", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "user" })
        .expect(400)
        .expect("Content-Type", /json/);
    });
    it("should return 201 Created if sent valid object", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "user", password: "password" })
        .expect(201)
        .expect("Content-Type", /json/);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 400 OK if login is invalid", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "user", password: "password" });

      return request(server)
        .post("/api/auth/login")
        .send({ username: "user", password: "wrongPassword" })
        .expect(400)
        .expect("Content-Type", /json/);
    });
    it("should return 200 OK if login is valid", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "user", password: "correctPassword" });

      return request(server)
        .post("/api/auth/login")
        .send({ username: "user", password: "correctPassword" })
        .expect(200)
        .expect("Content-Type", /json/);
    });
  });
});
