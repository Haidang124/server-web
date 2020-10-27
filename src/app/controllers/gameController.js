const Game = require("../../model/gameModel");
const jwt = require("jsonwebtoken");
const {
  handleErrorResponse,
  handleSuccessResponse,
  getCurrentId,
} = require("../../helper/responseHelper");
const { game } = require("../../routers/gameRouter");

module.exports.createGame = async (req, res) => {
  const { game_name, image_game, dataQuestion } = req.body;
  // dataQuestion : [ {question: "",key: 0, listAnswer: ["A", "B", "C", "D"],image:"url",time: 15,} ]
  try {
    const newGame = await Game.create({
      title: game_name,
      resources: {
        image: { image: image_game },
      },
      data: { array: dataQuestion },
    });
    return handleSuccessResponse(res, 200, {}, "Insert thành công !");
  } catch (err) {
    return handleErrorResponse(res, 400, "Insert thất bại !");
  }
};
module.exports.updateGame = async (req, res) => {
  const { game_id, game_name, image_game, dataQuestion } = req.body;
  // dataQuestion : [ {question: "",key: 0, listAnswer: ["A", "B", "C", "D"],image:"url",time: 15,} ]
  const game_result = await Game.findOne({ _id: game_id });
  if (game_result) {
    const result = await Game.update_game(
      game_id,
      game_name,
      image_game,
      dataQuestion
    );
    return handleSuccessResponse(res, 200, {}, "Update thành công");
  }
  return handleErrorResponse(res, 400, error.message);
};

module.exports.getGameName = async (req, res) => {
  const game_name = req.query.game_name;
  try {
    const game_result = await Game.find({ game_name: game_name });
    if (game_result) {
      return handleSuccessResponse(res, 200, game_result, "Success!");
    }
    return handleErrorResponse(res, 400, "Không tồn tại game!");
  } catch (error) {
    return handleErrorResponse(res, 400, e.message);
  }
};

module.exports.getGameId = async (req, res) => {
  const game_id = req.query.id;
  try {
    const game_result = await Game.findOne({ _id: game_id });
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
    const game_id = req.body.game_id;

    const result = await Game.deleteOne({ _id: game_id });
    if (result) {
      return handleSuccessResponse(res, 200, {}, "Delete Game success!");
    } else {
      return handleErrorResponse(res, 400, "ERROR... Không thể xóa!");
    }
  } catch (error) {
    return handleErrorResponse(res, 400, "ERROR! Not delete game!");
  }
};
