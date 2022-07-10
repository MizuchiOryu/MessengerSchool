require('dotenv').config()

const express = require("express");
const http = require('http');

const cors = require('cors')

const app = express();
const server = http.createServer(app)

app.use(express.json());

app.use(cors({ credentials: true, origin: 'http://client:3000' }));
// app.use(cors());

const friendshipRouter = require("./routes/Friendship");
const initMessengerSocket = require("./routes/Message");

initMessengerSocket(server);


app.use("/friendships", friendshipRouter);
app.get("/health", (_, res) => {
  console.log("OK")
  res.json({'message': 'OK'});
});

const port = process.env.APP_PORT;
server.listen(port, () => console.log(`Server started on port ${port}`));
