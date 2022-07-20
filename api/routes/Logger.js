const { Router } = require("express");
const checkAuth = require('../middlewares/checkAuth');
const Log  = require("../schemas/Log");

const logger = require("../lib/logger")

const router = new Router();

// get logs metrics
router.get("/", checkAuth, async (req, res) => {
  try {
    const logsMetrics = await Log.aggregate([
      {
        $group: {
          _id: {
            message: "$message",
            level: "$level"
          },
          count: {
            $sum: 1
          }
        }
      }, {
        $project: {
          _id: 0,
          level: "$_id.level",
          message: "$_id.message",
          count: 1
        }
      }, {
        $group: {
          _id: "metrics",
          data: {
            $addToSet: {
              count: "$count",
              level: "$level",
              message: "$message",
            }
          }
        }
      }, {
        $project: {
          _id: 0,
          data: 1,
          count: {
            $sum: "$data.count"
          }
        }
      }, {
        $unwind: {
          path: "$data",
          preserveNullAndEmptyArrays: false
        }
      }, {
        $project: {
          level: "$data.level",
          message: "$data.message",
          occurences: "$data.count",
          percent: {
            $round: [{
              $divide: [{
                $multiply: ["$data.count", 100]
              },
                "$count"
              ]
            }]
          }
        }
      },
      { $sort : { occurences : -1 } }
    ])

    res.json(logsMetrics);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
