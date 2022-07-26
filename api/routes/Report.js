const { Router } = require("express");
const Report = require("../models/Report");
const User = require("../models/User");
const { Op } = require('sequelize')
const checkAuth = require('../middlewares/checkAuth')
const logger = require('../lib/logger')
const checkAdmin = require("../middlewares/checkAdmin");
const { findUser } = require('../utils')

const router = new Router();

// get all reports
router.get("/", checkAuth, async (req, res) => {
    try {
        const where = req.user.isAdmin ? {} : { reporter: req.user.id };

        const result = await Report.findAll(where);

        const reports = await Promise.all(result.map(async (report) => {

            const reporter = await findUser(report.reporter)
            const target = await findUser(report.target)

            return {
                ...report.dataValues,
                reporter,
                target
            }
        }))

        res.json(reports);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// create report
router.post("/", checkAuth, async (req, res) => {
    try {
        const result = await Report.create({
            reporter: req.user.id,
            target: req.body.target,
        });
        res.status(201).json(result);
    } catch (error) {
        logger.error(error)
        res.sendStatus(500);
    }
});

// ban user
router.post("/:id/ban", checkAuth, checkAdmin, async (req, res) => {
    try {
        const report = await Report.findByPk(req.params.id);

        await User.update({
            isBanned: true,
        }, {
            where: {
                id: report.target
            }
        });

        await Report.update({
            isClosed: true
        }, {
            where: {
                target: report.target
            }
        });

        res.sendStatus(204);
    } catch (error) {
        logger.error(error);
        res.sendStatus(500);

    }
});

// close report
router.post("/:id/close", checkAuth, checkAdmin, async (req, res) => {
    try {
        const nbLines = await Report.update({
            isClosed: true,
        }, {
            where: {
                id: req.params.id,
            },
        });

        if (!nbLines) {
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
        }
    } catch (error) {
        logger.error(error)
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
