const jwt = require("jsonwebtoken");
const { users } = require("../../models");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");

    const checkToken = jwt.verify(token, process.env.SECRET_TOKEN);
    if (checkToken.id) {
      req.userTokenInfo = checkToken;
      console.log("Authorized");
      return next();
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
