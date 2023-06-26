const CustomAPIError = require("./CustomAPIError");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends CustomAPIError{
    constructor(message){
        super(message);
        this.status = StatusCodes.NotFoundError;
    }
}

module.exports = NotFoundError;