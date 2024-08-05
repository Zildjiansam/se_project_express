const jwt = require("jsonwebtoken");
const { UNAUTHORIZED_ERROR } = require("../utils/errorCodes");
const { JWT_SECRET } = require("../utils/config");

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: "Need authorization header in request body" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: "Authorization required!" });
  }
  req.user = payload;
  next();
};
