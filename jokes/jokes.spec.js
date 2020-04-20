const server = require("../api/server");
const request = require("supertest");

const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");

describe("GET /api/jokes", () => {
  it("should return 401 if no token is sent in header", () => {
    return request(server)
      .get("/api/jokes")
      .expect(401)
      .expect("Content-type", /json/);
  });

  it("should return 200 if user is logged in/token is sent in the header", async () => {
    const user = { username: "user", password: "password" };

    const token = generateToken(user);

    return request(server)
      .get("/api/jokes")
      .set("Authorization", token)
      .expect(200)
      .expect("Content-type", /json/);
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
