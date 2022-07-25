const { Router } = require("express");
const Profile = require('../models/Subject');
const { Op } = require('sequelize');
const checkAuth = require('../middlewares/checkAuth');
const User = require('../models/User');

const router = new Router();


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