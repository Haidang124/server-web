const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var gameSchema = Schema(
  {
    game_name: {
      type: String,
    },
    game_type: { type: String },
    question: { type: Array },
  },
  { timestamps: true }
);
const Game = mongoose.model("game", gameSchema);

module.exports = Game;
