const usersRouter = require("./usersRouter");
const gameRouter = require("./gameRouter");

module.exports = (app) => {
  app.use("/api/user", usersRouter);
  app.use("/api/game", gameRouter);
};
