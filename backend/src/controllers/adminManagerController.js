const jwtActions = require("../middleware/jwtActions");
const adminManagerModel = require("../models/adminManagerModel");
const bcrypt = require("bcrypt");
require("dotenv").config();

let login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Không được bỏ trống thông tin",
      });
    }

    let user = await adminManagerModel.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }

    let payload = {
      id: user._id,
    };

    const token = jwtActions.createJWT(payload);

    res.cookie("tokenAdmin", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      message: "Đăng nhập thành công",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Đã có lỗi xảy ra: Login",
    });
  }
};

let logout = async (req, res) => {
  try {
    // xóa cookie
    res.clearCookie("tokenAdmin");

    res.status(200).json({
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Đã có lỗi xảy ra: Logout",
    });
  }
};

let refresh = async (req, res) => {
  try {
    const adminId = req.adminId;

    let user = await adminManagerModel.findById(adminId);

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user",
      });
    }

    res.status(200).json({
      message: "Refresh thành công",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Đã có lỗi xảy ra: Refresh",
    });
  }
};

module.exports = {
  login,
  refresh,
  logout,
};
