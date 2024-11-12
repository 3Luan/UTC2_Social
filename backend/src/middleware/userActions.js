const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const sendResponse = require("../utils/sendResponse");

const checkUserBanned = async (req, res, next) => {
  const userId = req.userId;

  const user = await userModel.findById(userId);

  if (!user) {
    return sendResponse(res, 400, "Người dùng không tồn tại");
  }

  if (user?.isBan) {
    return sendResponse(res, 403, "Tài khoản của bạn đã bị khóa");
  }

  next();
};

const checkUserIsAdmin = async (req, res, next) => {
  const userId = req.userId;

  const user = await userModel.findById(userId);

  if (!user.isAdmin) {
    return sendResponse(res, 403, "Bạn không thể thực hiện thao tác này");
  }

  next();
};

module.exports = {
  checkUserBanned,
  checkUserIsAdmin,
};
