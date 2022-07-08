require('dotenv').config()

const express = require("express");
const app = express();

const friendshipRouter = require("./routes/Friendship");
// const exampleMiddleware = require("./middlewares/Example");

app.use(express.json());

app.get("/health", (_, res) => {
  res.send("OK");
});

app.use("/friendships", friendshipRouter);

const port = process.env.APP_PORT;
app.listen(port, () => console.log(`Server started ${port}`));
