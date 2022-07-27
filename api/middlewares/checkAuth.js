const { checkToken } = require("../lib/jwt");
const { User } = require("../models");
const { Subject } = require("../models");

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.sendStatus(401);
  }

  const [type, token] = header.split(/\s+/);
  if (type !== "Bearer") {
    return res.sendStatus(401);
  }

  const user = await checkToken(token);
  if (user) {
    req.user = await User.findByPk(user.id,
      {
        where: {
          active:true,
          recent_token:token,
          isBanned:false,
          isEdited:false
        },
        include: [
          {
            model: Subject,
            as: "tags",
          },
        ]
      }
    );

    if (!req.user) return res.sendStatus(401)

    next();
  } else {
    res.sendStatus(401);
  }
};
