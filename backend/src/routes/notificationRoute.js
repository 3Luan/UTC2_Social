const express = require("express");
const notificationController = require("../controllers/notificationController");
const { checkJWT } = require("../middleware/jwtActions");
const { checkUserBanned } = require("../middleware/userActions");
const router = express.Router();

router.get(
  "/getNotifications/:currentPage",
  checkJWT,
  checkUserBanned,
  notificationController.getNotifications
);

router.post(
  "/readNotification",
  checkJWT,
  checkUserBanned,
  notificationController.readNotification
);

router.post(
  "/readAllNotification",
  checkJWT,
  checkUserBanned,
  notificationController.readAllNotification
);

router.get(
  "/getUnreadNotification",
  checkJWT,
  checkUserBanned,
  notificationController.getUnreadNotifications
);

module.exports = router;
