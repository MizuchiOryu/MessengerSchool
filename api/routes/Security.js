const { Router } = require("express");
const { User } = require("../models");
const { ValidationError } = require("sequelize");
const url = require("url");
const bcryptjs = require("bcryptjs");
const { createToken, checkToken ,decryptToken,createTokenForVerifyToken} = require("../lib/jwt");
const router = new Router();

const formatError = (validationError) => {
  return validationError.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
  }, {});
};


router.post("/register", async (req, res) => {
  try {
    let result = await User.create(req.body);
    let {dataValues} = result
    let urlCustom = req.protocol + '://' + req.get('host') + "/verify?token=" + dataValues.recent_token;
    dataValues["active_your_account"] = urlCustom;
    res.status(201).json(dataValues);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      res.sendStatus(500);
      console.error(error);
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!result) {
      res.status(401).json({
        email: "Email not found",
      });
      return;
    }
    if (!(await bcryptjs.compare(req.body.password, result.password))) {
      res.status(401).json({
        password: "Password is incorrect",
      });
      return;
    }
    if(!result.active){
      res.status(401).json({
        active: "Your account is not active",
      });
      return;
    }
    res.json({ token: await createToken(result) });
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.get("/verify", async (req, res) => {
  try {
    let token = req.query.token;
    if(!token) throw new Error("not token");
    const verifyToken = await checkToken(token);
    if (!verifyToken) {
      res.sendStatus(500);
    }
    const decrypt = await decryptToken(token)
    return res.json({ "account_verify":decrypt });
    const result = await User.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      res.sendStatus(500);
      console.error(error);
    }
  }
});

module.exports = router;
