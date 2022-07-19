const { Router } = require("express");
const Report = require("../models/Report");
const User = require("../models/User");
const { Op } = require('sequelize')
const checkAuth = require('../middlewares/checkAuth')

const router = new Router();

// get all reports
router.get("/", checkAuth, async (req, res) => {
    try {
        if (req.user.isAdmin) {
            const result = await Report.findAll();
        } else {
            const result = await Report.findAll(
                {
                    where: {
                        reporter: req.user.id
                    },
                });
        }

        res.json(result);
    } catch (error) {
        res.sendStatus(500);
    }
});

// create report
router.post("/", checkAuth, async (req, res) => {
    try {
        const result = await Report.create({
            reporter: req.user,
            target: req.body.target,
            reason: req.body.reason,
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

// ban user
router.post("/ban/:id", checkAuth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            res.sendStatus(403);
        }

        const result = await User.update(
            {
                active: false,
            }, {
            where: {
                id: req.params.id
            }
        });

        const bannedUser = await User.update({
            active: false,
        }, {
            where: {
                id: result.target
            }
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

// close report
router.post("/close/:id", checkAuth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            res.sendStatus(403);
        }

        const nbLines = await Report.update({
            isClosed: true,
        }, {
            where: {
                id: req.report.id,
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

// cancel report
router.delete("/:id", checkAuth, async (req, res) => {
    try {
        const nbLines = await Report.destroy({
            where: {
                reporter: req.user.id,
                target: req.params.id
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
