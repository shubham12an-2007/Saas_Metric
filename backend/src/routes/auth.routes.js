const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.logInUser);

router.get("/profile", authMiddleware.protectRoute, authController.getProfile);

router.post("/logout", authController.logOutUser);

module.exports = router;
