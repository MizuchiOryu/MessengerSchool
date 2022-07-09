require('dotenv').config()

const express = require("express");
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app)
const SecurityRouter = require("./routes/Security");
const checkAuthentication = require("./middlewares/checkAuthentication");
const friendshipRouter = require("./routes/Friendship");
const initMessengerSocket = require("./routes/Message");
const homeRouter = require("./routes/Home");





app.use(cors({ credentials: true, origin: 'http://client:3000' }));
// app.use(cors());



initMessengerSocket(server);


app.use("/friendships", friendshipRouter);
app.get("/health", (_, res) => {
  console.log("OK")
  res.json({'message': 'OK'});
});


app.use(express.json());

app.use(SecurityRouter);
app.use("/home", checkAuthentication, homeRouter);

const port = process.env.APP_PORT;
server.listen(port, () => console.log(`Server started on port ${port}`));
