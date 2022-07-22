const mongoose = require("./db");

const LogSchema = new mongoose.Schema({
  timestamp: Date,
  message: String,
  level: String,
});

const Log = new mongoose.model("Log", LogSchema, 'logs');

module.exports = Log;
