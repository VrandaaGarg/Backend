//Will be used in Server.js

const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode); // Ensure status is set before response

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      return res.json({
        title: "Validation Error",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.UNAUTHORIZED:
      return res.json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.FORBIDDEN:
      return res.json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.NOT_FOUND:
      return res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.SERVER_ERROR:
      return res.json({
        title: "Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
    default:
      console.log("No error handler found");
      return res.status(500).json({
        title: "Unknown Error",
        message: err.message,
        stackTrace: err.stack,
      });
  }
};

module.exports = errorHandler;
