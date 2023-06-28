const { createToken, verifyToken } = require('./jwt');
const attachCookiesToResponse = require('./cookies');

module.exports = {
    createToken,
    verifyToken,
    attachCookiesToResponse
};