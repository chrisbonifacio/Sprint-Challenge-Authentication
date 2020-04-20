const db = require("../../database/dbConfig");

module.exports = { find, findBy, insert };

function find() {
  return db("users");
}

function findBy(filter) {
  return db("users")
    .select("*")
    .first()
    .where(filter);
}

function insert(user) {
  return db("users").insert(user);
}
