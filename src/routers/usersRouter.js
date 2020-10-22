const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/userController");
const authUser = require("../middleware/userMiddleware");

//router
router.get("/", userController.getUser);
router.post("/login", userController.loginUser);
router.post("/signup", userController.signUp);
router.use(authUser);
router.get("/getUser", userController.getCurrentUser);

module.exports = router;
