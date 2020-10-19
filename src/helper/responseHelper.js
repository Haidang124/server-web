// Handle success here
exports.handleSuccessResponse = async function (
  res,
  status = 200,
  data = null,
  message = null
) {
  return res.status(status).send({
    code: 1,
    message: message,
    data: data,
  });
};

// Handle error here
exports.handleErrorResponse = async function (
  res,
  status = 400,
  message = null
) {
  return res.status(status).send({
    code: 2,
    error: message,
  });
};
