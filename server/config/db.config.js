const dotenv = require('dotenv');

dotenv.config();

const database = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dialect = process.env.DB_DIALECT;
const logging = false;

module.exports = {
  database,
  username,
  password,
  host,
  dialect,
  port,
  logging
};
