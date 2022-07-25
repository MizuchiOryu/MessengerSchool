const { Router } = require("express");
const Subject = require('../models/Subject');
const checkAuth = require('../middlewares/checkAuth');
const User = require('../models/User');
const {sendEmailEditAccount} = require("../lib/mailer");
const { ValidationError } = require("sequelize");

const formatError = (validationError) => {
  return validationError.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
  }, {});
};

const logger = require('../lib/logger')


const router = new Router();

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