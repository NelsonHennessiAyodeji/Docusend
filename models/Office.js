const mongoose = require('mongoose');

const OfficeSchema = mongoose.Schema({
    roomNumber: {
        type: String,
        required: [true, "Please indicate your office number"],
        unique: [true, "Please provide a different room number"]
    },
    building: {
        type: String,
        required: [true, "Please indicate the building your office is in"],
        enum: {
            values: ["HQ", "annex"],
            message: "{VALUE} is not recognised in this organisation"
        }
    },
    department: {
        type: String,
        required: [true, "Please indicate your department"],
        enum: {
            values: ["ICT", "Security", "Electrical", "Training"],
            message: "{VALUE} is not recognised in this organisation"
        }
    },
    office: {
        type: String,
        required: [true, "Please indicate your office"],
        enum: {
            values: ["GM", "AGM"],
            message: "{VALUE} is not recognised in this organisation"
        }
    },
    password: {
        type: String,
        required: [true, "Please provide a password to proceed"]
    },
    role: {
        type: String,
        enum: ['admin', 'user']
    }
});

module.exports = mongoose.model('Office', OfficeSchema);