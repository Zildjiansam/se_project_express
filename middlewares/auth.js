const jwt = require("jsonwebtoken");
const { UNAUTHORIZED_ERROR } = require("../utils/errorCodes");
const { JWT_SECRET } = require("../utils/config");

module.exports.auth = (req, res, next) => {
  //Isolate authorization from header
  const { authorization } = req.headers;

  //Check to make sure authorization is present and formatted correctly
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: "Need authorization header in request body" });
  }
  //isolate token from authorization
  const token = authorization.replace("Bearer ", "");
  //Declare payload variable outside of try block so it can be accessed outside of try block
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
