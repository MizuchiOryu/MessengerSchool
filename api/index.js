require('dotenv').config()

const express = require("express");
const app = express();

// const exampleRouter = require("./routes/Example");
// const exampleMiddleware = require("./middlewares/Example");

app.use(express.json());

app.get("/", (_, res) => {
  res.send('Hello');
});

app.get("/health", (_, res) => {
  res.send("OK");
});

// app.use("/", exampleMiddleware, exampleRouter);

const port = process.env.APP_PORT;
app.listen(port, () => console.log(`Server started ${port}`));
