const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError
} = require("../errors");
const { Office } = require("../models/Office");
const { StatusCodes } = require("http-status-codes");

const getAnOffice = async (req, res) => {
  const { id: officeId } = req.params;
  const office = await Office.findOne({ _id: officeId }).select(
    "unit designation department email"
  );

  if (!office) {
    throw new NotFoundError(`There is no office with ID of ${officeId}`);
  }

  res.status(StatusCodes.OK).json(office);
};

const showCurrentOffice = async (req, res) => {
  const { officeId, officeUnit, officeDepartment, officeRole } = req.office;
  res
    .status(StatusCodes.OK)
    .json({ officeId, officeUnit, officeDepartment, officeRole });
};

const getAllOffice = async (req, res) => {
  const offices = await Office.find({}).select(
    "unit designation department email"
  );
  res.status(StatusCodes.OK).json(offices);
};

const updateOffice = async (req, res) => {
  const { officeId } = req.office;
  const { unit, designation, department, email } = req.body;
  const office = await Office.findOne({ _id: officeId });

  if (!office) {
    throw new NotFoundError("Office does not exists");
  }

  office.unit = unit;
  office.designation = designation;
  office.department = department;
  office.email = email;

  await office.save();

  res.status(StatusCodes.OK).json({ unit, designation, department, email });
};

const deleteOffice = async (req, res) => {
  res.status(StatusCodes.OK).json("Delete office");
};

const updateOfficePassword = async (req, res) => {
  const { officeId } = req.office;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please provide a new and an old password");
  }

  if (oldPassword === newPassword) {
    throw new BadRequestError("Your old and new password are matching");
  }

  const office = await Office.findOne({ _id: officeId });

  if (!office) {
    throw new NotFoundError(`There is no office with ID of ${officeId}`);
  }

  const isPasswordCorrect = await office.comparePasswords(oldPassword);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Your old password is incorrect");
  }

  office.password = newPassword;

  await office.save();

  res
    .status(StatusCodes.OK)
    .json("Your office's DOCUSEND password was successfully updated");
};

module.exports = {
  getAnOffice,
  showCurrentOffice,
  getAllOffice,
  updateOffice,
  deleteOffice,
  updateOfficePassword
};
