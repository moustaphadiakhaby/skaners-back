const express = require("express");
const router = express.Router();
const skanController = require("../controllers/skanController");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const isAuthenticated = require("../middleware/authMiddleware");

////// Admin and TinderLikeCarousel allSkans
router.get("/allSkans", isAuthenticated, skanController.allSkans);
////// Admin checkSkan isChecked -> true
router.put("/checkSkan", adminController.checkSkan);
////// deleteSkans
router.delete("/deleteSkan/:id", userController.deleteSkan);

module.exports = router;
