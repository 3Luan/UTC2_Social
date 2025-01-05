const express = require("express");
const courseController = require("../controllers/courseController");
const { checkAdminManagerJWT } = require("../middleware/jwtActions");
const router = express.Router();

router.post("/addCourse", checkAdminManagerJWT, courseController.addCourse);

router.post("/editCourse", checkAdminManagerJWT, courseController.editCourse);

router.post(
  "/deleteCourse",
  checkAdminManagerJWT,
  courseController.deleteCourse
);

router.get("/getCourses", courseController.getCourses);
router.get("/getCourses/:keyword", courseController.getCourses);

module.exports = router;
