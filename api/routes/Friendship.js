const { Router } = require("express");
const { Op } = require('sequelize')
const checkAuth = require('../middlewares/checkAuth');
const { Friendship, Message, User} = require("../models");

const {findUser} = require('../utils')

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

    const friends = await Promise.all(result.map(async (friendship) => {
      let friend;

      if (friendship._user != req.user.id){
        friend = await findUser(friendship._user)
      }else {
        friend = await findUser(friendship.friend)
      }

      return {
        friendship: friendship.id,
        friend
      }
    }))

    res.json(friends);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


// get all sent invites
router.get("/pending", checkAuth, async (req, res) => {
  try {
    const result = await Friendship.findAll(
      {
        where: {
          _user : req.user.id,
          isConfirmed: false
        }
      }
    );

    const friends = await Promise.all(result.map(async (friendship) => {
      let friend;

      if (friendship._user != req.user.id){
        friend = await findUser(friendship._user)
      }else {
        friend = await findUser(friendship.friend)
      }

      return {
        friendship: friendship.id,
        friend
      }
    }))

    res.json(friends);
  } catch (error) {
    console.error(error)
    res.sendStatus(500);
  }
});

// get all received invites
router.get("/invites", checkAuth, async (req, res) => {
  try {
    const result = await Friendship.findAll(
      {
        where: {
          friend : req.user.id,
          isConfirmed: false
        }
      }
    );

    const friends = await Promise.all(result.map(async (friendship) => {
      let friend;

      if (friendship._user != req.user.id){
        friend = await findUser(friendship._user)
      }else {
        friend = await findUser(friendship.friend)
      }

      return {
        friendship: friendship.id,
        friend
      }
    }))

    res.json(friends);
  } catch (error) {
    console.error(error)
    res.sendStatus(500);
  }
});

// get friendship information
router.get("/:id", checkAuth, async (req, res) => {
  try {
    
    const { id: userId } = req.user
    const friendship = await Friendship.findByPk(req.params.id);

    if(![friendship._user, friendship.friend].includes(userId)){
      return res.sendStatus(403)
    }

    if (userId === friendship._user) {
      friendship._user = await findUser(userId)
      friendship.friend = await findUser(friendship.friend)
    } else {
      friendship.friend = await findUser(friendship._user)
      friendship._user = await findUser(userId)
    }

    res.json(friendship);
  } catch (error) {
    console.error(error)
    res.sendStatus(500);
  }
});


// send an invitation to someone
router.post("/", checkAuth, async (req, res) => {
  try {

    const { friendId } = req.body
    const friendToAdd = await findUser(friendId)


    if (!friendToAdd){
      return res.status(404).send('user does not exist')
    }

    if ( req.user.id == friendId ) {
      return res.status(401).send('You can\'t invite yourself')
    }

    const friendShipExists = await Friendship.findOne({
      where: {
        [Op.or]: [
          { _user : req.user.id, friend: friendId },
          { _user : friendId, friend: req.user.id }
        ],
      }
    })

    if (friendShipExists) {
      return res.status(401).send('Friendship exists')
    }

    const result = await Friendship.create({
      _user: req.user.id,
      friend: friendId,
      isConfirmed: false
    });
    res.status(201).json(result);
  } catch (error) {
    console.error(error)
    res.sendStatus(500);
  }
});

// accept invite
router.put('/:id', checkAuth, async (req, res) => {
  try {
    const [nbLines, [result]] = await Friendship.update(
      {isConfirmed : true},
      {
        where: {
          friend : req.user.id,
          _user: req.params.id
        },
        returning: true,
      });
    if (!nbLines) {
      res.sendStatus(404);
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500)
  }
})

// cancel invite
router.delete("/invites/:id", checkAuth, async (req, res) => {
  try {
    const nbLines = await Friendship.destroy({
      where: {
        _user: req.user.id,
        friend: req.params.id,
        isConfirmed: false
      },
    });
    if (!nbLines) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error)
    res.sendStatus(500);
  }
});

router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const nbLines = await Friendship.destroy({
      where: {
        [Op.or]: [
          { _user: req.user.id, friend: req.params.id },
          { friend: req.user.id, _user: req.params.id },
        ],
        isConfirmed: true
      },
    });
    if (!nbLines) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error)
    res.sendStatus(500);
  }
});

// get conv messages
router.get("/:friendshipId/messages", checkAuth, async (req, res) => {
  try {
    const friendship = await Friendship.findOne(
      {
        where: {
          id: req.params.friendshipId,
          [Op.or]: [
            { _user : req.user.id },
            { friend: req.user.id }
          ],
        }
      }
    );

    if(!friendship){
      return res.sendStatus(404)
    }

    const messages = await Message.findAll(
      {
        where: {
          friendship: req.params.friendshipId
        }
      }
    )

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
