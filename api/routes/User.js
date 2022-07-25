const { Router } = require("express");
const User = require("../models/User");
const { ValidationError } = require("sequelize");
const {sendEmailCreateAccount,sendEmailBannedAccount} = require("../lib/mailer");
const checkAuth = require("../middlewares/checkAuth");
const logger = require('../lib/logger')
const {findUser} = require('../utils')
const Subject = require('../models/Subject');
const {sendEmailEditAccount} = require("../lib/mailer");


const router = new Router();

const formatError = (validationError) => {
  return validationError.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
  }, {});
};

router.patch("/edit",checkAuth, async (req, res) => {
    try {
        const user = await User.findOne({
          where: {
            id: req.user.id,
            active:true,
            // isBanned:false,
            // isEdited:false
          },
        });
        let {firstName,lastName,bio} = req.body
        const result = await user.set({firstName,lastName,bio}).save()
        let {dataValues} = result
        await sendEmailEditAccount(dataValues)
        res.status(200).json(dataValues);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(422).json(formatError(error));
      } else {
        logger.error(error);
        res.sendStatus(500);
      }
    }
});

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

router.post("/tags",checkAuth, async (req, res) => {
  try {
      const user = await User.findOne({
        where: {
          id: req.user.id,
          active:true,
          // isBanned:false,
          // isEdited:false
        },
      });
      // let {tag} = req.body;
      let tag = "Javascript";

      if(tag in user.tags) throw new Error("tag already linked to the user")

      const checkTagsExist = await Subject.findOne({
        where: {
          name: tag,
        },
      })

      const result = await user.addSubject(
        checkTagsExist
      )

      let {dataValues} = result
      res.status(200).json(dataValues);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      logger.error(error);
      res.sendStatus(500);
    }
  }
});

module.exports = router;