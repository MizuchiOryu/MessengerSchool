require('dotenv').config()

const express = require("express");
const http = require('http');

const app = express();
const server = http.createServer(app)

const friendshipRouter = require("./routes/Friendship");
const initMessengerSocket = require("./routes/Message");

initMessengerSocket(server);

app.use(express.json());

app.use("/friendships", friendshipRouter);
app.get("/health", (_, res) => {
  res.send("OK");
});

const port = process.env.APP_PORT;
server.listen(port, () => console.log(`Server started on port ${port}`));
