const { StatusCodes } = require("http-status-codes")

const errorHandler = (err, req, res, next) => {
    const error = {
        message: err.message || "Something went wrong on our end, please try agin later, thanks",
        statusCode: err.status || StatusCodes.INTERNAL_SERVER_ERROR
    }
    res.status(error.statusCode).json(error.message);
}

module.exports = errorHandler;