const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  SESSION_URI: process.env.SESSION_URI,
  SEND_GRID_API_KEY: process.env.SEND_GRID_API_KEY,
  SEND_GRID_EMAIL: process.env.SEND_GRID_SENDER_EMAIL
};