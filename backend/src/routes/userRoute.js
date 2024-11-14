const express = require("express");
const userController = require("../controllers/userController");
const { checkJWT, checkAdminManagerJWT } = require("../middleware/jwtActions");
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
  checkAdminManagerJWT,
  userController.getAllAdminUsers
);
router.get(
  "/getAllNonAdminUsers/:currentPage",
  checkAdminManagerJWT,
  userController.getAllNonAdminUsers
);

router.get(
  "/getAllAdminUsers/:currentPage/:keyword",
  checkAdminManagerJWT,
  userController.getAllAdminUsers
);
router.get(
  "/getAllNonAdminUsers/:currentPage/:keyword",
  checkAdminManagerJWT,
  userController.getAllNonAdminUsers
);

router.post(
  "/grantAdminRole",
  checkAdminManagerJWT,
  userController.grantAdminRole
);
router.post(
  "/revokeAdminRole",
  checkAdminManagerJWT,
  userController.revokeAdminRole
);

router.get(
  "/getUserStatistics",
  checkAdminManagerJWT,
  userController.getUserStatistics
);

router.get(
  "/getUserIsBanStatistics",
  checkAdminManagerJWT,
  userController.getUserIsBanStatistics
);

router.get(
  "/getUserNotBanStatistics",
  checkAdminManagerJWT,
  userController.getUserNotBanStatistics
);

router.post("/banUser", checkAdminManagerJWT, userController.banUser);
router.post("/unbanUser", checkAdminManagerJWT, userController.unbanUser);

router.get(
  "/getBanUsers/:currentPage",
  checkAdminManagerJWT,
  userController.getBanUsers
);

router.get(
  "/getBanUsers/:currentPage/:keyword",
  checkAdminManagerJWT,
  userController.getBanUsers
);

router.get(
  "/getNewUserStatistics/:day/:month/:year",
  checkAdminManagerJWT,
  userController.getNewUserStatistics
);

module.exports = router;
