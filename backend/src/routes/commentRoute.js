const express = require("express");
const commentController = require("../controllers/commentController");
const { checkJWT, checkAdminManagerJWT } = require("../middleware/jwtActions");
const {
  checkUserBanned,
  checkUserIsAdmin,
} = require("../middleware/userActions");
const router = express.Router();

router.post(
  "/createComment",
  checkJWT,
  checkUserBanned,
  commentController.createComment
);

router.post(
  "/createReply",
  checkJWT,
  checkUserBanned,
  commentController.createReply
);

router.get(
  "/getReplyByCommentId/:commentId",
  commentController.getReplyByCommentId
);

router.get("/getCommentByPostId/:postId", commentController.getCommentByPostId);
router.post(
  "/deleteComment",
  checkJWT,
  checkUserBanned,
  checkUserIsAdmin,
  commentController.deleteComment
);

//Admin Manager
router.get(
  "/getDeleteComments/:currentPage",
  checkAdminManagerJWT,
  commentController.getDeleteComments
);

module.exports = router;
