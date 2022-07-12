require('dotenv').config()

const express = require("express");
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app)
const SecurityRouter = require("./routes/Security");
const friendshipRouter = require("./routes/Friendship");
const initMessengerSocket = require("./routes/Message");
const homeRouter = require("./routes/Home");

// app.use(cors());

app.use(express.json());

app.use(SecurityRouter);
app.use("/home", homeRouter);
app.use("/friendships",friendshipRouter);
app.use(cors({ credentials: true, origin: 'http://client:3000' }));

initMessengerSocket(server);

const port = process.env.APP_PORT;
server.listen(port, () => console.log(`Server started on port ${port}`));
