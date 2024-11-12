const express = require("express");
const userController = require("../controllers/userController");
const { checkJWT } = require("../middleware/jwtActions");
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

module.exports = router;
