require('dotenv').config()

const express = require("express");
const http = require('http');
const morgan = require('morgan')
const logger = require('./lib/logger')
const cors = require('cors');

const app = express();
const server = http.createServer(app)
const SecurityRouter = require("./routes/Security");
const friendshipRouter = require("./routes/Friendship");
const initMessengerSocket = require("./routes/MessageSocket");
const loggerRouter = require("./routes/Logger");
const reportRouter = require("./routes/Report");
const userRouter = require("./routes/User");

app.use(morgan('tiny'))
// app.use(cors());
app.use(cors({ credentials: true, origin: process.env.VITE_CLIENT_URL }));

app.use(express.json());

app.use(SecurityRouter);
app.use("/friendships",friendshipRouter);
app.use("/logs", loggerRouter);
app.use("/reports", reportRouter);
app.use("/user", userRouter);

initMessengerSocket(server);

const port = process.env.PORT;
server.listen(port, () => logger.info(`Server started on port ${port}`));


