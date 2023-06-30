const { Office } = require("../models/Office");
const { attachCookiesToResponse } = require("../utilities");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { roomNumber, building, department, officeHead } = req.body;
  const isFirstAccount = (await Office.find({})).length === 0;
  const role = isFirstAccount ? "admin" : "user";

  const office = await Office.create({ ...req.body, role: role });

  if (!office) {
    throw new BadRequestError(
      "Please make sure you provide correct values to all field"
    );
  }

  const officePayload = {
    officeRoomNumber: roomNumber,
    officeBuilding: building,
    officeDepartment: department,
    officeHead: officeHead,
    officeRole: role,
    officeId: office._id,
  };

  attachCookiesToResponse(res, officePayload);
  res
    .status(StatusCodes.CREATED)
    .json({ roomNumber, department, building, role });
};

const login = async (req, res) => {
  const { roomNumber, department, password } = req.body;

  if (!roomNumber || !department || !password) {
    throw new BadRequestError(
      "Please provide the roomNumber, department and the office's password to login"
    );
  }
  const office = await Office.findOne({ roomNumber });

  if (!office) {
    throw new NotFoundError(
      "The office with this room number or department does not exists"
    );
  }

  const passwordIsCorrect = await office.comparePasswords(password);

  if (!passwordIsCorrect) {
    throw new UnauthenticatedError("The password you provided is incorrect");
  }

  const officePayload = {
    officeRoomNumber: office.roomNumber,
    officeBuilding: office.building,
    officeDepartment: office.department,
    officeHead: office.officeHead,
    officeRole: office.role,
    officeId: office._id,
  };

  attachCookiesToResponse(res, officePayload);
  res
    .status(StatusCodes.OK)
    .json({
      roomNumber: office.roomNumber,
      department: office.department,
      building: office.building,
      role: office.role,
    });
};

const logout = async (req, res) => {
  res.cookie("officeToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json("Successfully Logged out");
};

module.exports = {
  register,
  login,
  logout,
};
