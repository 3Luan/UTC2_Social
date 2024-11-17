const express = require("express");
const postController = require("../controllers/postController");
const { checkJWT, checkAdminManagerJWT } = require("../middleware/jwtActions");
const router = express.Router();

const multer = require("multer");
const {
  checkUserBanned,
  checkUserIsAdmin,
} = require("../middleware/userActions");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/createPost",
  checkJWT,
  checkUserBanned,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "files", maxCount: 10 },
  ]),
  postController.createPost
);

router.post(
  "/updatePost",
  checkJWT,
  checkUserBanned,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "files", maxCount: 10 },
  ]),
  postController.updatePost
);

router.get("/getPosts/:currentPage", postController.getPosts);
router.get("/getPosts/:currentPage/:keyword", postController.getPosts);

router.get(
  "/getUnapprovedPosts/:currentPage",
  checkJWT,
  checkUserBanned,
  postController.getUnapprovedPosts
);
router.get(
  "/getUnapprovedPosts/:currentPage/:keyword",
  checkJWT,
  checkUserBanned,
  postController.getUnapprovedPosts
);

router.get(
  "/getHistoryPosts/:currentPage",
  checkJWT,
  checkUserBanned,
  postController.getHistoryPosts
);
router.get(
  "/getHistoryPosts/:currentPage/:keyword",
  checkJWT,
  checkUserBanned,
  postController.getHistoryPosts
);

router.get("/getPostDetailById/:postId", postController.getPostDetailById);
router.get(
  "/getPostUnapprovedDetailById/:postId",
  checkJWT,
  checkUserBanned,
  postController.getPostUnapprovedDetailById
);

router.post("/toggleLikePost", checkJWT, postController.toggleLikePost);
router.post(
  "/approvedPost",
  checkJWT,
  checkUserBanned,
  checkUserIsAdmin,
  postController.approvedPost
);
router.post(
  "/deletePost",
  checkJWT,
  checkUserBanned,
  postController.deletePost
);

router.post("/savePost", checkJWT, checkUserBanned, postController.savePost);
router.post(
  "/UnsavePost",
  checkJWT,
  checkUserBanned,
  postController.UnsavePost
);
router.get(
  "/getSavedPosts/:currentPage",
  checkJWT,
  checkUserBanned,
  postController.getSavedPosts
);
router.get(
  "/getSavedPosts/:currentPage/:keyword",
  checkJWT,
  checkUserBanned,
  postController.getSavedPosts
);
router.get(
  "/getSavedPostId",
  checkJWT,
  checkUserBanned,
  postController.getSavedPostId
);

/////////////////////////// ADMIN MANAGER ///////////////////////////

router.get(
  "/getDeletePosts/:currentPage",
  checkAdminManagerJWT,
  postController.getDeletePosts
);

router.get(
  "/getPostsStatistics/:day/:month/:year",
  checkAdminManagerJWT,
  postController.getPostsStatistics
);

router.get(
  "/getUnapprovedPostsStatistics/:day/:month/:year",
  checkAdminManagerJWT,
  postController.getUnapprovedPostsStatistics
);

router.get(
  "/getApprovedPostsStatistics/:day/:month/:year",
  checkAdminManagerJWT,
  postController.getApprovedPostsStatistics
);

router.get(
  "/getPostDeleteDetailById/:postId",
  checkAdminManagerJWT,
  postController.getPostDeleteDetailById
);

module.exports = router;
