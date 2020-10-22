// Handle success here
const jwt = require("jsonwebtoken");
exports.handleSuccessResponse = async function (
  res,
  status = 200,
  data = null,
  message = null
) {
  return res.status(status).send({
    code: 1,
    message: message,
    data: data,
  });
};
exports.getCurrentId = (req) => {
  return new Promise((resolve, reject) => {
    var id = "";
    const token =
      req.body.token ||
      req.query.token ||
      req.headers["x-access-token"] ||
      req.cookies.token;
    if (!token) {
      id = "";
    } else {
      jwt.verify(token, "ptud web", function (err, decoded) {
        if (err) {
          id = "";
        } else {
          id = decoded.id;
        }
      });
    }
    resolve(id);
  });
};
// Handle error here
exports.handleErrorResponse = async function (
  res,
  status = 400,
  message = null
) {
  return res.status(status).send({
    code: 2,
    error: message,
  });
};
1