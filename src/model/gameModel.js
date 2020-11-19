const mongoose = require("mongoose");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../helper/responseHelper");

var Schema = mongoose.Schema;

var gameSchema = Schema(
  {
    username: { type: String, default: "username" },
    game_type: {
      type: String,
      default: "happy-circle",
    },
    title: {
      type: String,
      default: "Happy circle",
    },
    cover: {
      type: String,
      default: "https://source.unsplash.com/user/erondu/1600x900",
    },
    resources: {
      image: {
        next: {
          type: String,
          default:
            "https://res.cloudinary.com/vnu-uet/image/upload/v1604432947/Next-Button-PNG-HD_od9apu.png",
        },
        analist: {
          type: String,
          default:
            "https://res.cloudinary.com/vnu-uet/image/upload/v1605043111/anlist_w7m1yc.png",
        },
        1: {
          type: String,
          default:
            "https://api.hoclieu.vn/images/game/562d379eaa13270f8c70eaf18765ed81.png",
        },
        2: {
          type: String,
          default:
            "https://api.hoclieu.vn/images/game/2dc69b7d671bacb8d877bda86ec7412d.png",
        },
        3: {
          type: String,
          default:
            "https://api.hoclieu.vn/images/game/f91370a48014240140a7a6f9158d9c31.png",
        },
        4: {
          type: String,
          default:
            "https://api.hoclieu.vn/images/game/26aaf5764006083edc9f24ae0197c5ee.png",
        },
        cup_ranking: {
          type: String,
          default:
            "https://api.hoclieu.vn/images/game/436843730189a8318dc065e80b1db8c5.png",
        },
        stopwatchClicked: {
          type: String,
          default:
            "https://api.hoclieu.vn/images/game/918b7a04aa321548b640e1acabba2a3e.png",
        },
        image: {
          type: String,
          default:
            "https://res.cloudinary.com/vnu-uet/image/upload/v1604476964/02f7d734-e656-4ca6-9df6-08dad2a233a3_bhvzlp.png",
        },
        correctTick: {
          type: String,
          default:
            "https://api.hoclieu.vn/images/game/b88cb1c9f7113524fb76d93676210c5e.png",
        },
        wrongTick: {
          type: String,
          default:
            "https://api.hoclieu.vn/images/game/7c5c11d24f05cf6f7e37214fcbd44823.png",
        },
      },
      audio: {
        type: String,
      },
    },
    data: {
      startObject: { type: String, default: "startImage" },
      objects: { type: Array, default: ["obj_1", "obj_2", "obj_3", "obj_4"] },
      array: {
        type: Array,
        default: [],
      },
    },
  },
  { timestamps: true }
);

gameSchema.statics.update_game = async function (
  gameId,
  gameName,
  imageGame,
  dataQuestion
) {
  // data: {gameId, gameName, imageGame, dataQuestion}
  const result = await this.updateOne(
    { _id: gameId },
    {
      $set: {
        title: gameName,
        resources: { image: { image: imageGame } },
        data: {
          array: dataQuestion,
        },
      },
    }
  );
  if (result) return true;
  throw Error("Update thất bại!");
};

gameSchema.statics.getGameId = async function (gameId) {
  try {
    const game_result = await Game.findOne({ _id: gameId });
    if (game_result) {
      return game_result;
    }
    return false;
  } catch (error) {
    throw Error("Không thể truy xuất!");
  }
};

const Game = mongoose.model("game", gameSchema);

module.exports = Game;
