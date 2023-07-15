const { UnauthenticatedError } = require("../errors");
const { verifyToken } = require("../utilities");

const authenticateUser = (req, res, next) => {
  const { officeToken } = req.signedCookies;

  if (!officeToken) {
    throw new UnauthenticatedError("Invalid token");
  }

  const {
    officeUnit,
    officeEmail,
    officeDepartment,
    officeDesignation,
    officeRole,
    officeId
  } = verifyToken(officeToken);

  req.office = {
    officeUnit,
    officeEmail,
    officeDepartment,
    officeDesignation,
    officeRole,
    officeId
  };
  next();
};

module.exports = authenticateUser;
