const { Router } = require("express");
const router = new Router();



router.get("/", async (req, res) => {
  res.send('Hello');
});


module.exports = router;
