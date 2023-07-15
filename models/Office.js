const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const OfficeSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true
  },
  unit: {
    type: String,
    required: [true, "Please indicate your office's unit"]
  },
  designation: {
    type: String,
    required: [true, "Please indicate your office"],
    enum: {
      values: ["GM", "AGM"],
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
  interactions: {
    type: [mongoose.Types.ObjectId],
    ref: "Interaction",
    required: true
  },
  password: {
    type: String,
    required: [true, "Please provide a password to proceed"]
  },
  role: {
    type: String,
    enum: ["admin", "user"]
  }
});

OfficeSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

OfficeSchema.methods.comparePasswords = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const InteractionSchema = mongoose.Schema({
  office1: {
    type: mongoose.Types.ObjectId,
    ref: "Office",
    required: true
  },
  office2: {
    type: mongoose.Types.ObjectId,
    ref: "Office",
    required: true
  }
});

const PersonalInteractionSchema = mongoose.Schema(
  {
    thisOffice: {
      type: mongoose.Types.ObjectId,
      ref: "Office",
      required: true
    },
    to: {
      type: mongoose.Types.ObjectId,
      ref: "Office",
      required: true
    },
    interaction: {
      type: [mongoose.Types.ObjectId],
      ref: "Interaction",
      required: true
    },
    trigger: Number
  },
  { timestamps: true }
);

const Office = mongoose.model("Office", OfficeSchema);
const Interaction = mongoose.model("Interaction", InteractionSchema);
const PersonalInteraction = mongoose.model(
  "PersonalInteraction",
  PersonalInteractionSchema
);

module.exports = { Office, Interaction, PersonalInteraction };
