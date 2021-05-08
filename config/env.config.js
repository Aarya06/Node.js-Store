const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  sessionUri: process.env.SESSION_URI
};