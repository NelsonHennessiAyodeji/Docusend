const { NotFoundError, BadRequestError, UnauthenticatedError } = require("../errors");
const Office = require("../models/Office");
const { StatusCodes } = require("http-status-codes");

const getAnOffice = async (req, res) => {
    const { id: officeId } = req.params;
    const office = await Office.findOne({_id: officeId}).select('roomNumber officeHead department building');

    if(!office){
        throw new NotFoundError(`There is no office with ID of ${officeId}`);
    }

    res.status(StatusCodes.OK).json(office);
};

const showCurrentOffice = async (req, res) => {
    const { officeId, officeRoomNumber, officeDepartment, officeRole} = req.office;
    res.status(StatusCodes.OK).json({officeId, officeRoomNumber, officeDepartment, officeRole});
};

const getAllOffice = async (req, res) => {
    const offices = await Office.find({}).select('roomNumber officeHead department building');
    res.status(StatusCodes.OK).json(offices);
};

const updateOffice = async (req, res) => {
    const { officeId } = req.office;
    const { roomNumber, officeHead, department, building } = req.body;
    const office = await Office.findOne({_id: officeId});

    if(!office){
        throw new NotFoundError("Office does not exists");
    }

    office.roomNumber = roomNumber;
    office.officeHead = officeHead;
    office.department = department;
    office.building = building;

    await office.save();

    res.status(StatusCodes.OK).json({ roomNumber, officeHead, department, building });
};

const deleteOffice = async (req, res) => {
    res.status(StatusCodes.OK).json("Delete office");
};

const updateOfficePassword = async (req, res) => {
    const { officeId } = req.office;
    const { oldPassword, newPassword } = req.body;
    
    if(!oldPassword || !newPassword){
        throw new BadRequestError("Please provide a new and an old password");
    }

    if(oldPassword === newPassword){
        throw new BadRequestError("Your old and new password are matching");
    }

    const office = await Office.findOne({_id: officeId});

    if(!office){
        throw new NotFoundError(`There is no office with ID of ${officeId}`);
    }

    const isPasswordCorrect = await office.comparePasswords(oldPassword);

    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Your old password is incorrect");
    }

    office.password = newPassword;

    await office.save();

    res.status(StatusCodes.OK).json("Your office DOCUSEND password was successfully updated");
}

module.exports = {
    getAnOffice,
    showCurrentOffice,
    getAllOffice,
    updateOffice,
    deleteOffice,
    updateOfficePassword
};