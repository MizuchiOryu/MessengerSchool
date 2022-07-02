const express = require("express");
const app = express();

// const exampleRouter = require("./routes/Example");
// const exampleMiddleware = require("./middlewares/Example");

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Home");
});

app.get("/health", (req, res, next) => {
  res.send("OK");
});

// app.use("/", exampleMiddleware, exampleRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started ${port}`));
