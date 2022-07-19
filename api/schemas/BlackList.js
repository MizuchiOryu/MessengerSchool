const mongoose = require("./db");

const BlackListSchema = new mongoose.Schema({
  words: Array,
});

const BlackList = new mongoose.model("BlackList", BlackListSchema);

module.exports = BlackList;
