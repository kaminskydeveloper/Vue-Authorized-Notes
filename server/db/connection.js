const monk = require("monk");

const db = monk("localhost/authDB");

module.exports = db;
