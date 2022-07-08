const { Router } = require("express");
const Friendship = require("../models/Friendship");
const { Op } = require('sequelize')
const checkAuth = require('../middlewares/checkAuth')

const router = new Router();

// get all friends
router.get("/", checkAuth, async (req, res) => {
  try {
    const result = await Friendship.findAll(
      {
        where: {
          [Op.or]: [
            { _user : req.user.id },
            { friend: req.user.id }
          ],
          isConfirmed: true
        }
      }
    );

    res.json(result);
  } catch (error) {
    res.sendStatus(500);
  }
});

// get all pending invites
router.get("/", checkAuth, async (req, res) => {
  try {
    const result = await Friendship.findAll(
      {
        where: {
          _friend : req.user.id,
          isConfirmed: false
        }
      }
    );

    res.json(result);
  } catch (error) {
    res.sendStatus(500);
  }
});

// send an invitation to someone
router.post("/", checkAuth, async (req, res) => {
  try {
    const result = await Friendship.create({
      _user: req.user,
      friend: req.body.friend,
      isConfirmed: false
    });
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json(formatError(error));
    } else {
      res.sendStatus(500);
    }
  }
});

// cancel invite
router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const nbLines = await Friendship.destroy({
      where: {
        _user: req.user.id,
        friend: req.params.id
      },
    });
    if (!nbLines) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
