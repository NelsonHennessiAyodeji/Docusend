const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./CustomAPIError");

class BadRequestError extends CustomAPIError{
    constructor(message){
        SourceBuffer(message);
        this.status = StatusCodes.BAD_REQUEST;
    }
}

module.exports = BadRequestError;