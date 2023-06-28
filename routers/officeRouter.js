const express = require('express');
const router = express.Router();
const {
    getAnOffice,
    showCurrentOffice,
    getAllOffice,
    updateOffice,
    deleteOffice,
    updateOfficePassword
} = require('../controllers/officeController');
const authenticateUser = require('../middleware/authentication');

router.route('/').get(authenticateUser, getAllOffice);
router.route('/showMe').get(authenticateUser, showCurrentOffice);
router.route('/update').put(authenticateUser, updateOffice);
router.route('/updatePassword').put(authenticateUser, updateOfficePassword);
router.route('/delete').delete(authenticateUser, deleteOffice);
router.route('/:id').get(authenticateUser, getAnOffice);

module.exports = router;