const jwt = require("jsonwebtoken");

exports.createToken = async (user) => {
  const payload = {
    id: user.id,
    firstname: user.firstname,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.checkToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return {
      id: decoded.id,
      firstname: decoded.firstname,
      isAdmin: decoded.isAdmin,
    };
  } catch (error) {
    return false;
  }
};


exports.decryptToken = async (token) => {
  try {
    const decoded = await jwt.decryptToken(token,process.env.JWT_SECRET);
    console.log(decoded)
    return {
      id: decoded.id,
      firstname: decoded.firstname,
      isAdmin: decoded.isAdmin,
    };
  } catch (error) {
    return false;
  }
};

exports.createTokenForVerifyToken = async (user) => {
  const payload = {
    id: user.id
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};
