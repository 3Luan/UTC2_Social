const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/sendResponse");

const createJWT = (payload) => {
  let secret = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, secret, { expiresIn: "365d" });
  } catch (error) {
    console.log(error);
  }
  return token;
};

const checkJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return sendResponse(res, 401, "Đăng nhập để thực hiện thao tác này");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (error, resutl) => {
    if (error) {
      if (!token) {
        sendResponse(res, 401, "Đăng nhập để thực hiện thao tác này");
      }
    }

    // check jwt thành công sẽ lưu userId vào req
    req.userId = resutl.id;
    next();
  });
};

const checkAdminJWT = (req, res, next) => {
  const token = req.cookies.tokenAdmin;

  if (!token) {
    if (!token) {
      sendResponse(res, 401, "Đăng nhập để thực hiện thao tác này");
    }
  }
  jwt.verify(token, process.env.JWT_SECRET, async (error, resutl) => {
    if (error) {
      if (!token) {
        sendResponse(res, 401, "Đăng nhập để thực hiện thao tác này");
      }
    }

    // check jwt thành công sẽ lưu userId vào req
    req.adminId = resutl.id;
    next();
  });
};

module.exports = {
  createJWT,
  checkJWT,
  checkAdminJWT,
};
