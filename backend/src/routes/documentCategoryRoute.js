const express = require("express");
const documentCategoryController = require("../controllers/documentCategoryController");
const { checkAdminManagerJWT } = require("../middleware/jwtActions");
const router = express.Router();

router.post(
  "/addCategory",
  checkAdminManagerJWT,
  documentCategoryController.addCategory
);

router.post(
  "/editCategory",
  checkAdminManagerJWT,
  documentCategoryController.editCategory
);

router.post(
  "/deleteCategory",
  checkAdminManagerJWT,
  documentCategoryController.deleteCategory
);

router.get("/getCategories", documentCategoryController.getCategories);
router.get("/getCategories/:keyword", documentCategoryController.getCategories);

module.exports = router;
