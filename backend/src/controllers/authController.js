const jwtActions = require("../middleware/jwtActions");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const sendResponse = require("../utils/sendResponse");
require("dotenv").config();
const passport = require("passport");
const VerificationCodeModel = require("../models/VerificationCodeModel");
const sendMail = require("../utils/sendEmail");

let register = async (req, res) => {
  try {
    const { name, email, password, gender, birth } = req.body;

    if (!name || !email || !password || !gender || !birth) {
      throw {
        status: 401,
        message: "Không được bỏ trống thông tin",
      };
    }

    let user = await userModel.findOne({ email });

    if (user) {
      throw {
        status: 401,
        message: "Email đã tồn tại",
      };
    }

    // Kiểm tra xem địa chỉ email đã tồn tại trong cơ sở dữ liệu chưa
    const existingVerificationCode = await VerificationCodeModel.findOne({
      email,
    });

    const generateNewVerificationCode = () => {
      return Math.random().toString(36).slice(2, 8).toUpperCase();
    };

    if (existingVerificationCode) {
      // Nếu địa chỉ email đã tồn tại, cập nhật lại mã xác thực mới
      existingVerificationCode.code = generateNewVerificationCode();
      await existingVerificationCode.save();

      // Gửi lại mã xác thực qua email
      await sendMail(email, existingVerificationCode.code);

      sendResponse(res, 200, "Mã xác thực mới đã được gửi lại");
    } else {
      // Nếu địa chỉ email chưa tồn tại, tạo bản ghi mới
      const verificationCode = generateNewVerificationCode();
      await VerificationCodeModel.create({ email, code: verificationCode });

      // Gửi mã xác thực qua email
      await sendMail(email, verificationCode);

      sendResponse(res, 200, "Vui lòng kiểm tra email để nhận mã xác thực");
    }
  } catch (error) {
    sendResponse(
      res,
      error?.status || 500,
      error.message || "Internal Server Error"
    );
  }
};

const verifyCode = async (req, res) => {
  try {
    const { code, name, email, password, gender, birth } = req.body;

    if (!code || !name || !email || !password || !gender || !birth) {
      throw {
        status: 400,
        message: "Lỗi: Thông tin không đủ",
      };
    }

    let user = await userModel.findOne({ email });

    if (user) {
      throw {
        status: 409,
        message: "Email đã tồn tại",
      };
    }

    // Tìm mã xác thực trong cơ sở dữ liệu
    const verificationCode = await VerificationCodeModel.findOne({
      email,
      code,
    });

    if (!verificationCode) {
      throw {
        status: 401,
        message: "Mã xác thực không hợp lệ",
      };
    }

    // Kiểm tra xem mã xác thực có hết hạn không (nếu có)
    const expirationTime = 15 * 60 * 1000; // Thời gian hết hạn của mã xác thực (miligiây), ví dụ 24 giờ
    const currentTime = new Date();
    const codeTime = verificationCode.createdAt.getTime();
    if (currentTime - codeTime > expirationTime) {
      throw {
        status: 401,
        message: "Mã xác thực đã hết hạn",
      };
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Chuyển chuỗi ngày thành kiểu dữ liệu Date
    const birthDate = new Date(birth);
    user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      gender,
      birth: birthDate, // Lưu giá trị kiểu Date vào trường birth
    });

    let payload = {
      id: user._id,
    };

    const token = jwtActions.createJWT(payload);

    // Lưu token vào cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      sameSite: "none",
      secure: true,
    });

    // Xóa mã xác thực sau khi đã được sử dụng
    await VerificationCodeModel.deleteOne({ email, code });

    sendResponse(res, 200, "Đăng ký thành công", {
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

let logout = async (req, res) => {
  try {
    // Xóa cookie
    res.clearCookie("token", {
      sameSite: "none",
      secure: true,
    });

    sendResponse(res, 200, "Đăng xuất thành công");
  } catch (error) {
    sendResponse(
      res,
      error?.status || 500,
      error.message || "Internal Server Error"
    );
  }
};

module.exports = {
  register,
  verifyCode,
  login,
  logout,
};
