const express = require("express");
const adminManagerController = require("../controllers/adminManagerController");
const { checkAdminManagerJWT } = require("../middleware/jwtActions");
const router = express.Router();

router.post("/login", adminManagerController.login);
router.post("/refresh", checkAdminManagerJWT, adminManagerController.refresh);
router.post("/logout", adminManagerController.logout);

module.exports = router;
