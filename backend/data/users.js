const bcrypt = require("bcryptjs");

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("aaaaa", 10),
    isAdmin: true,
  },
  {
    name: " User1",
    email: "user1@example.com",
    password: bcrypt.hashSync("bbbbb", 10),
  },
  {
    name: " User2",
    email: "user2@example.com",
    password: bcrypt.hashSync("ccccc", 10),
  },
];

module.exports = users;
