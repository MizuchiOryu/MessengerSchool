const { Router } = require("express");
const router = new Router();
const checkAuth = require('../middlewares/checkAuth')



router.get("/", checkAuth,async (req, res) => {
  res.send('Hello');
});


module.exports = router;
