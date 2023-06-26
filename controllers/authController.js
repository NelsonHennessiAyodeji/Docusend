const Office = require('../models/Office');
const { BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
    const isFirstAccount = (await Office.find({})).length === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const office = await Office.create({...req.body, role: role});

    if(!office){
        throw new BadRequestError("Please make sure you provide correct values to all field");
    }
    res.status(StatusCodes.OK).json(office);
};

const login = async (req, res) => {
    res.status(StatusCodes.OK).json("Login");
};

const logout = async (req, res) => {
    res.status(StatusCodes.OK).json("Logout");
};

module.exports = {
    register,
    login,
    logout
};