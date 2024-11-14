const express = require("express");
const documentController = require("../controllers/documentController");
const { checkJWT, checkAdminManagerJWT } = require("../middleware/jwtActions");
const router = express.Router();
const {
  checkUserBanned,
  checkUserIsAdmin,
} = require("../middleware/userActions");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/createDocument",
  checkJWT,
  checkUserBanned,
  upload.fields([{ name: "files", maxCount: 1 }]),
  documentController.createDocument
);

router.post(
  "/updateDocument",
  checkJWT,
  checkUserBanned,
  upload.fields([{ name: "files", maxCount: 1 }]),
  documentController.updateDocument
);

router.get("/getDocuments/:currentPage", documentController.getDocuments);
router.get(
  "/getDocuments/:currentPage/:keyword",
  documentController.getDocuments
);

router.get(
  "/getHistoryDocuments/:currentPage",
  checkJWT,
  checkUserBanned,
  documentController.getHistoryDocuments
);
router.get(
  "/getHistoryDocuments/:currentPage/:keyword",
  checkJWT,
  checkUserBanned,
  documentController.getHistoryDocuments
);
router.get(
  "/getUnApprovedDocuments/:currentPage",
  checkJWT,
  checkUserBanned,
  documentController.getUnApprovedDocuments
);
router.get(
  "/getUnApprovedDocuments/:currentPage/:keyword",
  checkJWT,
  checkUserBanned,
  documentController.getUnApprovedDocuments
);

router.get(
  "/getDocumentDetailById/:documentId",
  documentController.getDocumentDetailById
);
router.get(
  "/getDocumentUnApprovedDetailById/:documentId",
  checkJWT,
  checkUserBanned,
  documentController.getDocumentUnApprovedDetailById
);

router.post(
  "/toggleLikeDocument",
  checkJWT,
  checkUserBanned,
  documentController.toggleLikeDocument
);

router.post(
  "/approvedDocument",
  checkJWT,
  checkUserBanned,
  checkUserIsAdmin,
  documentController.approvedDocument
);
router.post(
  "/deleteDocument",
  checkJWT,
  checkUserBanned,
  documentController.deleteDocument
);

router.post(
  "/saveDocument",
  checkJWT,
  checkUserBanned,
  documentController.saveDocument
);
router.post(
  "/unSaveDocument",
  checkJWT,
  checkUserBanned,
  documentController.unSaveDocument
);

router.get(
  "/getSavedDocuments/:currentPage",
  checkJWT,
  checkUserBanned,
  documentController.getSavedDocuments
);
router.get(
  "/getSavedDocuments/:currentPage/:keyword",
  checkJWT,
  checkUserBanned,
  documentController.getSavedDocuments
);

/////////////////////////// ADMIN MANAGER ///////////////////////////

router.get(
  "/getDeleteDocuments/:currentPage",
  checkAdminJWT,
  documentController.getDeleteDocuments
);

router.get(
  "/getDocumentStatistics/:day/:month/:year",
  checkAdminJWT,
  documentController.getDocumentStatistics
);

router.get(
  "/getUnapprovedDocumentStatistics/:day/:month/:year",
  checkAdminJWT,
  documentController.getUnapprovedDocumentStatistics
);

router.get(
  "/getApprovedDocumentStatistics/:day/:month/:year",
  checkAdminJWT,
  documentController.getApprovedDocumentStatistics
);

router.get(
  "/getDocumentDeleteDetailById/:documentId",
  checkAdminJWT,
  documentController.getDocumentDeleteDetailById
);

module.exports = router;
