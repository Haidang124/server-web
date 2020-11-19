const usersRouter = require("./usersRouter");
const gameRouter = require("./gameRouter");
const { cloudinary } = require("../helper/cloudinary");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../helper/responseHelper");

module.exports = (app) => {
  app.use("/api/user", usersRouter);
  app.use("/api/game", gameRouter);
  app.get("/api/images", async (req, res) => {
    const { resources } = await cloudinary.search
      .expression("folder:dev_setups")
      .sort_by("public_id", "desc")
      .max_results(30)
      .execute();

    const publicIds = resources.map((file) => file.public_id);
    res.send(publicIds);
  });
  app.post("/api/upload/", async (req, res) => {
    try {
      const fileStr = req.body.data;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: "dev_setups",
      });
      console.log(uploadResponse);
      return handleSuccessResponse(
        res,
        200,
        { uploadResponse: uploadResponse },
        "Upload thành công !"
      );
    } catch (err) {
      console.error(err);
      return handleErrorResponse(res, 500, "Something went wrong !");
    }
  });
};
