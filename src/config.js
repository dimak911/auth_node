require("dotenv").config();

const { PORT = 8080, DB_URI, JWT_SECRET } = process.env;

module.exports = {
  PORT,
  DB_URI,
  JWT_SECRET,
};
