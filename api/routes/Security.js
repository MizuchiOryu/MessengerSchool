const { Router } = require("express");
const User = require("../models/User");
const { ValidationError } = require("sequelize");
const bcryptjs = require("bcryptjs");
const { createToken ,checkTokenForVerify,createTokenForResetPassword,checkTokenResetPassword} = require("../lib/jwt");
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
    let token = await createToken(result)
    let user = await result.set({recent_token:token}).save()
    res.json({ token });
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.get("/verify", async (req, res) => {
  try {
    let token = req.query.token;
    if(!token) throw new Error("not token");
    const verifyToken = await checkTokenForVerify(token);
    if (!verifyToken) {
      res.sendStatus(500);
    }
    const user = await User.findOne({
      where: {
        email: verifyToken.email,
        active:false
      },
    });
    if (!user) {
      res.sendStatus(500);
      return;
    }
    if (user.recent_token !== token) {
      res.status(401);
      return ;
    }
    const result = await user.set({active:true}).save()
    return res.json({ "account_verify":true });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      console.error(error);
      res.sendStatus(500);
    }
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    let email = req.body.email;
    if(!email) throw new Error("not email");
    const user = await User.findOne({
      where: {
        email: email,
        active:true
      },
    });
    if (!user) {
      res.status(422).json({"message":`The user does not exist or you must activate your account before you can reset your password`});
      return;
    }
    let token = await createTokenForResetPassword(user)
    const result = await user.set({recent_token:token}).save()
    //let urlCustom = req.protocol + '://' + req.get('host') + "/verify?token=" + dataValues.recent_token;
    //send email
    return res.json({ "reset_password":true });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      console.error(error);
      res.sendStatus(500);
    }
  }
});

router.get("/reset-password", async (req, res) => {
  try {
    let token = req.query.token;
    if(!token) throw new Error("not token");
    const verifyToken = await checkTokenResetPassword(token);
    if (!verifyToken) {
      res.sendStatus(500);
    }
    const user = await User.findOne({
      where: {
        id: verifyToken.id,
        active:true
      },
    });
    if (!user) {
      res.sendStatus(500);
      return;
    }
    if (user.recent_token !== token) {
      res.status(401);
      return ;
    }
    return res.json({ "acces":true });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      console.error(error);
      res.sendStatus(500);
    }
  }
});

router.patch("/reset-password", async (req, res) => {
  try {
    let token = req.body.token;
    let newPassword = req.body.password;
    if(!token) throw new Error("not token");
    if(!newPassword) throw new Error("not newPassword");
    if(password.length > 6) throw new Error("The password must be at least 6 characters long ");
    const verifyToken = await checkTokenResetPassword(token);
    if (!verifyToken) {
      res.sendStatus(500);
    }
    const user = await User.findOne({
      where: {
        id: verifyToken.id,
        active:true
      },
    });
    if (!user) {
      res.sendStatus(500);
      return;
    }
    if (user.recent_token !== token) {
      res.status(401);
      return ;
    }
    const result = user.set({password:newPassword,recent_token:null}).save()
    return res.json({ "reset-password":true });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      console.error(error);
      res.sendStatus(500);
    }
  }
});

module.exports = router;
