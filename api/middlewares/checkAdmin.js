module.exports = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.sendStatus(401);
  }

  next()
};
