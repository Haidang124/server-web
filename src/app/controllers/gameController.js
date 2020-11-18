const Game = require("../../model/gameModel");
const jwt = require("jsonwebtoken");
const {
  handleErrorResponse,
  handleSuccessResponse,
  getCurrentId,
} = require("../../helper/responseHelper");
const { game } = require("../../routers/gameRouter");

module.exports.createGame = async (req, res) => {
  const { gameName, imageGame, dataQuestion } = req.body;
  // dataQuestion : [ {question: "",key: 0, listAnswer: ["A", "B", "C", "D"],image:"url",time: 15,} ]
  try {
    const newGame = await Game.create({
      title: gameName,
      resources: {
        image: { image: imageGame },
      },
      data: { array: dataQuestion },
    });
    return handleSuccessResponse(res, 200, {}, "Create kahoot thành công !");
  } catch (err) {
    return handleErrorResponse(res, 400, "Create kahoot thất bại !");
  }
};
module.exports.updateGame = async (req, res) => {
  const { gameId, gameName, imageGame, dataQuestion } = req.body;
  // dataQuestion : [ {question: "",key: 0, listAnswer: ["A", "B", "C", "D"],image:"url",time: 15,} ]
  const game_result = await Game.findOne({ _id: gameId });
  if (game_result) {
    const result = await Game.update_game(
      gameId,
      gameName,
      imageGame,
      dataQuestion
    );
    return handleSuccessResponse(res, 200, {}, "Update thành công");
  }
  return handleErrorResponse(res, 400, error.message);
};

module.exports.getGameName = async (req, res) => {
  const gameName = req.query.gameName;
  try {
    const game_result = await Game.find({ gameName: gameName });
    if (game_result) {
      return handleSuccessResponse(res, 200, game_result, "Success!");
    }
    return handleErrorResponse(res, 400, "Không tồn tại game!");
  } catch (error) {
    return handleErrorResponse(res, 400, e.message);
  }
};

module.exports.getGameId = async (req, res) => {
  const gameId = req.query.id;
  try {
    const game_result = await Game.findOne({ _id: gameId });
    if (game_result) {
      return handleSuccessResponse(res, 200, game_result, "Success!");
    }
    return handleErrorResponse(res, 400, "Không tồn tại game!");
  } catch (error) {
    return handleErrorResponse(res, 400, e.message);
  }
};

module.exports.getAllGame = async (req, res) => {
  try {
    const gameAll = await Game.find();
    return handleSuccessResponse(res, 200, gameAll, "Success!");
  } catch (error) {
    return handleErrorResponse(res, 400, "Error!");
  }
};

module.exports.deleteGame = async (req, res) => {
  try {
    const gameId = req.body.gameId;

    const result = await Game.deleteOne({ _id: gameId });
    if (result) {
      return handleSuccessResponse(res, 200, {}, "Delete Game success!");
    } else {
      return handleErrorResponse(res, 400, "ERROR... Không thể xóa!");
    }
  } catch (error) {
    return handleErrorResponse(res, 400, "ERROR! Not delete game!");
  }
};
