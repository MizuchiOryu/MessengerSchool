const jwt = require("jsonwebtoken");

exports.createToken = (user) => {
  const payload = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

exports.checkToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      id: decoded.id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      bio: decoded.bio,
      email: decoded.email,
      isAdmin: decoded.isAdmin,
    };
  } catch (error) {
    return false;
  }
};
