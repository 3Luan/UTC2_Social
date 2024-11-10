const jwtActions = require("../middleware/jwtActions");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const sendResponse = require("../utils/sendResponse");
require("dotenv").config();

let login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw {
        status: 400,
        message: "Không được bỏ trống thông tin",
      };
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      throw {
        status: 401,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw {
        status: 401,
        message: "Tài khoản hoặc mật khẩu không chính xác",
      };
    }

    if (user?.isBan) {
      throw {
        status: 403,
        message: "Tài khoản của bạn đã bị khóa",
      };
    }

    let payload = {
      id: user._id,
    };

    const token = jwtActions.createJWT(payload);

    // Lưu token vào cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 365, // 1 năm
      sameSite: "none",
      secure: true,
    });

    sendResponse(res, 200, "Đăng nhập thành công", {
      user,
      token,
    });
  } catch (error) {
    sendResponse(
      res,
      error?.status || 500,
      error.message || "Internal Server Error"
    );
  }
};

module.exports = {
  login,
};
