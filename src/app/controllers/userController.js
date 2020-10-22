const User = require("../../model/userModel");
const jwt = require("jsonwebtoken");
const {
  handleErrorResponse,
  handleSuccessResponse,
  getCurrentId,
} = require("../../helper/responseHelper");
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "ptud web", {
    expiresIn: maxAge,
  });
};

module.exports.getUser = (req, res, next) => {};
module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("token", token, { httpOnly: false, maxAge: maxAge * 1000 });
    return handleSuccessResponse(
      res,
      200,
      { userId: user.id },
      "Đăng nhập thành công !"
    );
  } catch (error) {
    return handleErrorResponse(res, 400, "Đăng nhập thất bại !");
  }
};
module.exports.signUp = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    return handleSuccessResponse(
      res,
      200,
      { userId: user.id },
      "Đăng kí thành công !"
    );
  } catch (err) {
    return handleErrorResponse(res, 400, "Đăng ki thất bại !");
  }
};
module.exports.getCurrentUser = async (req, res) => {
  let id = await getCurrentId(req);
  handleSuccessResponse(res, 200, { id: id });
};
