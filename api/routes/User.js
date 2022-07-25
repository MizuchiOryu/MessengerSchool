const { Router } = require("express");
const User = require("../models/User");
const { ValidationError } = require("sequelize");
const {sendEmailCreateAccount,sendEmailBannedAccount} = require("../lib/mailer");
const checkAuth = require("../middlewares/checkAuth");
const logger = require('../lib/logger')
const {findUser} = require('../utils')
const Profile = require('../models/Subject');


const router = new Router();

const formatError = (validationError) => {
  return validationError.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
  }, {});
};

router.post("/",checkAuth ,async (req, res) => {
  try {
    if(req.body.isAdmin && !req.user.isAdmin){
      throw new Error("No permission to create this user");
    }
    let bodyIsAdmin = req.body.isAdmin ?? false;
    let randomPassword = Math.random().toString(36).slice(-8);
    let result = await User.create({...req.body,active:false,isAdmin:bodyIsAdmin,recent_token:null,isEdited:false,password:randomPassword});
    let {dataValues} = result
    await sendEmailCreateAccount(dataValues,randomPassword)
    res.status(201).json(dataValues);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      logger.error(error);
      res.sendStatus(500);
    }
  }
});

router.get("/",checkAuth ,async (req, res) => {
  try {
    if(!req.user.isAdmin){
      throw new Error("No permission to get all user");
    }
    const result = await User.findAll({
      attributes : {
        exclude : [
          'password',
          'recent_token'
        ]
      }
    });
    res.json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      logger.error(error);
      res.sendStatus(500);
    }
  }
});

router.patch("/banned",checkAuth ,async (req, res) => {
  try {
    if(!req.user.isAdmin){
      throw new Error("No permission to banned user");
    }
    const user = await findUser(req.body.id_user)
    const handleBanned = await user.set({isBanned:true,recent_token:null}).save()
    await sendEmailBannedAccount(user)
    return res.json({ "banned":true });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      logger.error(error);
      res.sendStatus(500);
    }
  }
});

router.put('/edit/:id', (req, res) => {
    User.update({
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        bio: req.user.bio,
        email: req.user.email,
        password: req.user.password
    }, {
        where: { id: req.user.id }
    }
    ).then(() => res.send("success"))
});

module.exports = router;