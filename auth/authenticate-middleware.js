/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, secrets.jwtSecret, err => {
    if (err) {
      res.status(401).json({ you: "shall not pass!" });
    } else {
      next();
    }
  });
};
