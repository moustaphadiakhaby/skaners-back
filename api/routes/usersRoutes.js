const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const isAuthenticated = require("../middleware/authMiddleware");
const fileUpload = require("express-fileupload");

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);

router.get("/user/info/:id", isAuthenticated, userController.userInfo);
router.put("/user/update/:id", isAuthenticated, userController.updateUser);
router.delete("/user/delete/:id", userController.deleteUser);
router.get("/api/users", isAuthenticated, userController.allUsers);

router.put("/user/likeSneaker", isAuthenticated, userController.likeSneaker);
router.put(
  "/user/unlikeSneaker",
  isAuthenticated,
  userController.unlikeSneaker
);

router.put("/user/likePicture", isAuthenticated, userController.likePictures);
router.put(
  "/user/unlikePicture",
  isAuthenticated,
  userController.unlikePictures
);

////// User add skan with his id
router.post("/user/addSkan", fileUpload(), userController.addSkan);
router.put("/user/likeSkan", isAuthenticated, userController.likeSkan);
router.put("/user/unlikeSkan", isAuthenticated, userController.unlikeSkan);

// router.put("/user/removeSkan", userController.removeSkan);

module.exports = router;
