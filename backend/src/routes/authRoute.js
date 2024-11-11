const express = require("express");
const authController = require("../controllers/authController");
const { checkJWT } = require("../middleware/jwtActions");
const { checkUserBanned } = require("../middleware/userActions");
const router = express.Router();

router.post("/register", authController.register);
router.post("/verifyCode", authController.verifyCode);

router.post("/sendForgotPassword", authController.sendForgotPassword);
router.post(
  "/verifyCodeForgotPassword",
  authController.verifyCodeForgotPassword
);

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", checkJWT, checkUserBanned, authController.refresh);

router.post(
  "/updatePassword",
  checkJWT,
  checkUserBanned,
  authController.updatePassword
);

module.exports = router;
