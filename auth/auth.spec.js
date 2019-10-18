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

  describe("GET /api/auth/users", () => {
    it("should return 401 if no token is sent in header", () => {
      return request(server)
        .get("/api/auth/users")
        .expect(401)
        .expect("Content-type", /json/);
    });

    it("should return 200 if user is logged in/token is sent in the header", async () => {
      const user = { username: "user", password: "password" };
      await request(server)
        .post("/api/auth/register")
        .send({ username: "user", password: "password" });

      await request(server)
        .post("/api/auth/login")
        .send({ username: "user", password: "password" })
        .expect(200)
        .expect("Content-Type", /json/);

      const token = generateToken(user);

      return request(server)
        .get("/api/auth/users")
        .set("Authorization", token)
        .expect(200)
        .expect("Content-type", /json/);
    });
  });
});

function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    username: user.username
    // ...otherData
  };

  const options = {
    expiresIn: "1d" // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}
