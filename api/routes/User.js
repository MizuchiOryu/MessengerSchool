const { Router } = require("express");
const User = require("../models/User");
const { ValidationError } = require("sequelize");
const {sendEmailCreateAccount,sendEmailBannedAccount} = require("../lib/mailer");
const checkAuth = require("../middlewares/checkAuth");
const logger = require('../lib/logger')
const {findUser} = require('../utils')
const Subject = require('../models/Subject');
const {sendEmailEditAccount} = require("../lib/mailer");
const sequelize = require("../models/db");
const { Op } = require("sequelize");


const router = new Router();

const formatError = (validationError) => {
  return validationError.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
  }, {});
};

const { Friendship } = require("../models");
const checkAdmin = require("../middlewares/checkAdmin");
router.patch("/edit",checkAuth, async (req, res) => {
  try {
    let {firstName,lastName,bio} = req.body
    const result = await req.user.set({firstName,lastName,bio}).save()
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

router.post("/",checkAuth, checkAdmin ,async (req, res) => {
  try {
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

router.get("/",checkAuth , checkAdmin,async (req, res) => {
  try {
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

router.get("/tags",checkAuth, async (req, res) => {
  try {
    const result = await Subject.findAll();
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

router.post("/tags",checkAuth, async (req, res) => {
  try {
    const user = req.user

    let {tag} = req.body;
    let tagsUser = user.tags.map((t)=>(t.name))
    if(tagsUser.includes(tag)) throw new Error("tag already linked to the user")

    const checkTagsExist = await Subject.findOne({
      where: {
        name: tag
      },
    })
    const result = await user.addTags(checkTagsExist)
    await sendEmailEditAccount(user)
    res.sendStatus(201);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      logger.error(error);
      res.sendStatus(500);
    }
  }
});

router.delete("/tags",checkAuth, async (req, res) => {
  try {
    const user = req.user      
    let {tag} = req.body;
    let tagsUser = user.tags.map((t)=>(t.name))
    if(!tagsUser.includes(tag)) throw new Error("tag don't linked to the user")

    const checkTagsExist = await Subject.findOne({
      where: {
        name: tag
      },
    })
    const result = await user.removeTags(checkTagsExist)
    await sendEmailEditAccount(user)
    res.sendStatus(202);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      logger.error(error);
      res.sendStatus(500);
    }
  }
});

router.get("/recommend_tags",checkAuth, async (req, res) => {
  try {
    let querySequilize = {
      order: sequelize.random() ,
      limit:1,
      include: [
        {
          model: User,
          as: "users",
          where: {
            id: {[Op.ne]: req.user.id}
          }
        }
      ]
    }
    if(req.params.tag){
      querySequilize["where"] = {name:req.params.tag}
    }
    const result = await Subject.findOne(querySequilize);
    if (!result)
      return res.json([])

    const {users} = result

    const asyncFilter = async (users, predicate) => {
      const results = await Promise.all(users.map(predicate));
      return users.filter((_v, index) => results[index]);
    }

    const asyncRes = await asyncFilter(users, async (u) => {
      let isFriend = await Friendship.findOne(
        {
          where: {
            [Op.or]: [
              {
                _user: req.user.id ,
                friend: u.id
              },
              {
                _user: u.id,
                friend: req.user.id
              },
            ]
          }
        }
      )
      return !!!isFriend
    });

    res.json(asyncRes);

  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      logger.error(error);
      console.log(error)
      res.sendStatus(500);
    }
  }
});

module.exports = router;
