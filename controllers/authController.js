const { Office } = require("../models/Office");
const { attachCookiesToResponse } = require("../utilities");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { unit, designation, department, email } = req.body;
  const isFirstAccount = (await Office.find({})).length === 0;
  const role = isFirstAccount ? "admin" : "user";

  const office = await Office.create({ ...req.body, role: role });

  if (!office) {
    throw new BadRequestError(
      "Please make sure you provide correct values to all field"
    );
  }

  const officePayload = {
    officeUnit: unit,
    officeDesignation: designation,
    officeDepartment: department,
    email: email,
    officeRole: role,
    officeId: office._id
  };

  attachCookiesToResponse(res, officePayload);
  res.status(StatusCodes.CREATED).json({ unit, department, designation, role });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError(
      "Please provide the office's email and password to login"
    );
  }
  const office = await Office.findOne({ email });

  if (!office) {
    throw new NotFoundError("The office does not exists");
  }

  const passwordIsCorrect = await office.comparePasswords(password);

  if (!passwordIsCorrect) {
    throw new UnauthenticatedError("The password you provided is incorrect");
  }

  const officePayload = {
    officeUnit: office.unit,
    officeDesignation: office.designation,
    officeDepartment: office.department,
    email: office.email,
    officeRole: office.role,
    officeId: office._id
  };

  attachCookiesToResponse(res, officePayload);
  res.status(StatusCodes.OK).json({
    unit: office.unit,
    department: office.department,
    designation: office.designation,
    role: office.role
  });
};

const logout = async (req, res) => {
  res.cookie("officeToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now())
  });
  res.status(StatusCodes.OK).json("Successfully Logged out");
};

module.exports = {
  register,
  login,
  logout
};
