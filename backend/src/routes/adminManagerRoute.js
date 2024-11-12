const express = require("express");
const adminManagerController = require("../controllers/adminManagerController");
const { checkAdminJWT } = require("../middleware/jwtActions");
const router = express.Router();

router.post("/login", adminManagerController.login);
router.post("/refresh", checkAdminJWT, adminManagerController.refresh);
router.post("/logout", adminManagerController.logout);

module.exports = router;
