const { UnauthenticatedError } = require("../errors");
const { verifyToken } = require("../utilities");

const authenticateUser = (req, res, next) => {
    const { officeToken } = req.signedCookies;

    if(!officeToken){
        throw new UnauthenticatedError("Invalid token");
    }

    const {
        officeRoomNumber,
        officeBuilding,
        officeDepartment,
        officeHead,
        officeRole,
        officeId
    } = verifyToken(officeToken);

    req.office = {
        officeRoomNumber,
        officeBuilding,
        officeDepartment,
        officeHead,
        officeRole,
        officeId
    };
    next();
};

module.exports = authenticateUser;