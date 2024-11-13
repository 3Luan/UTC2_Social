const express = require("express");
const userController = require("../controllers/userController");
const { checkJWT, checkAdminJWT } = require("../middleware/jwtActions");
const { checkUserBanned } = require("../middleware/userActions");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/").get(checkJWT, userController.getUsers);
router.post("/follow", checkJWT, userController.followUser);
router.post("/unfollow", checkJWT, userController.unfollowUser);

router.post(
  "/updateProfile",
  checkJWT,
  checkUserBanned,
  upload.fields([{ name: "pic", maxCount: 1 }]),
  userController.updateProfile
);

router.get(
  "/getUnfollowed/:currentPage",
  checkJWT,
  checkUserBanned,
  userController.getUnfollowedUsers
);

router.get(
  "/getFollowings/:currentPage",
  checkJWT,
  checkUserBanned,
  userController.getFollowings
);

router.get(
  "/getFollowers/:currentPage",
  checkJWT,
  checkUserBanned,
  userController.getFollowers
);

router.get(
  "/getUnfollowed/:currentPage/:keyword",
  checkJWT,
  checkUserBanned,
  userController.getUnfollowedUsers
);

router.get(
  "/getFollowings/:currentPage/:keyword",
  checkJWT,
  checkUserBanned,
  userController.getFollowings
);

router.get(
  "/getFollowers/:currentPage/:keyword",
  checkJWT,
  checkUserBanned,
  userController.getFollowers
);

router.get(
  "/getUserInfoById/:userId",
  checkJWT,
  checkUserBanned,
  userController.getUserInfoById
);

////////////////////////Admin Manager//////////////////////
router.get(
  "/getAllAdminUsers/:currentPage",
  checkAdminJWT,
  userController.getAllAdminUsers
);
router.get(
  "/getAllNonAdminUsers/:currentPage",
  checkAdminJWT,
  userController.getAllNonAdminUsers
);

router.get(
  "/getAllAdminUsers/:currentPage/:keyword",
  checkAdminJWT,
  userController.getAllAdminUsers
);
router.get(
  "/getAllNonAdminUsers/:currentPage/:keyword",
  checkAdminJWT,
  userController.getAllNonAdminUsers
);

router.post("/grantAdminRole", checkAdminJWT, userController.grantAdminRole);
router.post("/revokeAdminRole", checkAdminJWT, userController.revokeAdminRole);

router.get(
  "/getUserStatistics",
  checkAdminJWT,
  userController.getUserStatistics
);

router.get(
  "/getUserIsBanStatistics",
  checkAdminJWT,
  userController.getUserIsBanStatistics
);

router.get(
  "/getUserNotBanStatistics",
  checkAdminJWT,
  userController.getUserNotBanStatistics
);

router.post("/banUser", checkAdminJWT, userController.banUser);
router.post("/unbanUser", checkAdminJWT, userController.unbanUser);
router.get(
  "/getBanUser/:currentPage/:keyword",
  checkAdminJWT,
  userController.getBanUser
);

router.get(
  "/getNewUserStatistics/:day/:month/:year",
  checkAdminJWT,
  userController.getNewUserStatistics
);

module.exports = router;
