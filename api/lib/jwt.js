const jwt = require("jsonwebtoken");

exports.createToken = async (user) => {
  const payload = {
    id: user.id,
    firstname: user.firstname,
    isAdmin: user.isAdmin,
    email: user.email,
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
      email:decoded.email
    };
  } catch (error) {
    return false;
  }
};

exports.checkTokenForVerify = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return {
      email: decoded.email,
    };
  } catch (error) {
    return false;
  }
};


exports.createTokenForVerifyToken = async (user) => {

  const payload = {
    email: user.email
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};


exports.checkTokenResetPassword = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return {
      id: decoded.id,
    };
  } catch (error) {
    return false;
  }
};


exports.createTokenForResetPassword= async (user) => {

  const payload = {
    id: user.id
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};