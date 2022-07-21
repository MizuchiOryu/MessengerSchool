const { Router, Router } = require("express");
const Profile = require('../models/Subject');
const { Op } = require('sequelize');
const checkAuth = require('../middlewares/checkAuth');
const User = require('../models/User');

const router = new Router();


router.put('/edit', (req, res) => {
    Op.User.update({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        bio: req.body.bio,
        email: req.body.email,
        password: req.body.password
    }, {
        where: { id: req.body.id }
    }
    ).then(() => res.send("success"))
});

module.exports = router;