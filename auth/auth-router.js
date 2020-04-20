const router = require("express").Router();

const Users = require("../api/users/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");

const authenticate = require("../auth/authenticate-middleware");

router.get("/users", authenticate, async (req, res) => {
  const users = await Users.find();
  res.status(200).json(users);
});

router.post("/register", async (req, res) => {
  // implement registration
  const { username, password } = req.body;
  if (username && password) {
    try {
      await Users.insert({ username, password: bcrypt.hashSync(password, 8) });
      res.status(201).json({ message: "Registered successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to register" });
    }
  } else {
    res.status(400).json({ message: "Please provide username and password" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // implement login
  var user = await Users.findBy({ username });

  if (user && bcrypt.compareSync(password, user.password)) {
    let token = generateToken(user);
    res.status(200).json({ message: `Welcome!`, token });
  } else {
    res.status(400).json({ message: "Invalid Credentials" });
  }
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

module.exports = router;
