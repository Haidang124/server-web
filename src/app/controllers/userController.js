const User = require("../../model/userModel");
const jwt = require("jsonwebtoken");
const {
  handleErrorResponse,
  handleSuccessResponse,
  getCurrentId,
} = require("../../helper/responseHelper");
const { use } = require("../../routers/usersRouter");
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
  const { email, username, password } = req.body;
  try {
    const user = await User.create({ email, username, password });
    return handleSuccessResponse(
      res,
      200,
      { userId: user.id },
      "Đăng kí thành công !"
    );
  } catch (err) {
    return handleErrorResponse(res, 400, "Đăng kí thất bại !");
  }
};

module.exports.updateAccount = async (req, res) => {
  const data = req.body; //{newUsername, newAvatar, newLanguage, newBirthday, }

  const user_id = await getCurrentId(req);
  try {
    let new_data = await User.checkNewData(data);
    const query = await User.updateFields(user_id, new_data);
    return handleSuccessResponse(
      res,
      200,
      { userId: user_id },
      "Update thành công!"
    );
  } catch (error) {
    return handleErrorResponse(res, 400, error.message);
  }
};

module.exports.getCurrentUser = async (req, res) => {
  let id = await getCurrentId(req);
  handleSuccessResponse(res, 200, { id: id });
};

module.exports.logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return handleSuccessResponse(res, 200, {}, "Đăng xuất thành công!");
  } catch (error) {
    return handleErrorResponse(res, 400, "Đăng xuất thất bại!");
  }
};

module.exports.changePassword = async (req, res) => {
  const data = req.body; // {oldPassword, newPassword}
  const user_id = await getCurrentId(req);
  const email = await (await User.findOne({ _id: user_id })).get("email");
  if (email) {
    try {
      const user = await User.login(email, data.oldPassword);
      let query = await User.changePassword(user_id, data.newPassword);
      return handleSuccessResponse(
        res,
        200,
        {},
        "Thay đổi password thành công!"
      );
    } catch (error) {
      return handleErrorResponse(res, 400, error.message == "incorrect password"?"ERROR! Incorrect current password.": error.message);
    }
  } else {
    return handleErrorResponse(res, 400, "No Found User");
  }
};

module.exports.getUserInfo = async (req, res) => {
  // return data :{username, email, avatar, language, birthday, role}
  try {
    const user_id = await getCurrentId(req);
    const user = await User.findOne({ _id: user_id });
    if (user) {
      return handleSuccessResponse(
        res,
        200,
        {
          role: user.get("role"),
          avatar: user.get("avatar"),
          language: user.get("language"),
          email: user.get("email"),
          username: user.get("username"),
          birthday:
            (user.get("birthday")
              ? String(user.get("birthday").getFullYear())
              : "2000") +
            "-" +
            (user.get("birthday")
              ? String(user.get("birthday").getMonth() + 1) <= "9"
                ? "0" + String(user.get("birthday").getMonth() + 1)
                : String(user.get("birthday").getMonth() + 1)
              : "01") +
            "-" +
            (user.get("birthday")
              ? String(user.get("birthday").getDate()) <= "9"
                ? "0" + String(user.get("birthday").getDate())
                : String(user.get("birthday").getDate())
              : "01"),
        },
        "Get User Complate!"
      );
    }
    return handleErrorResponse(res, 400, "Get User ERROR!");
  } catch (error) {
    return handleErrorResponse(res, 400, "No Found User");
  }
};
