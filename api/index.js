require('dotenv').config()

const express = require("express");
const http = require('http');
const morgan = require('morgan')
const cors = require('cors');

const app = express();
const server = http.createServer(app)
const SecurityRouter = require("./routes/Security");
const friendshipRouter = require("./routes/Friendship");
const initMessengerSocket = require("./routes/MessageSocket");

app.use(morgan('tiny'))
// app.use(cors());
app.use(cors({ credentials: true, origin: process.env.VITE_CLIENT_URL }));

app.use(express.json());

app.use(SecurityRouter);
app.use("/friendships",friendshipRouter);

initMessengerSocket(server);

const port = process.env.APP_PORT;
server.listen(port, () => console.log(`Server started on port ${port}`));
