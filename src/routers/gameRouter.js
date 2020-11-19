const express = require("express");
const router = express.Router();
const gameController = require("../app/controllers/gameController");
const authUser = require("../middleware/userMiddleware");

//router
router.use(authUser);
router.post("/create-game", gameController.createGame);
router.get("/get-game-name", gameController.getGameName);
router.get("/get-game-id", gameController.getGameId);
router.get("/get-all-game", gameController.getAllGame);
router.post("/deleteGame", gameController.deleteGame);
router.post("/updateGame", gameController.updateGame);
module.exports = router;
