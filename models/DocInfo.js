const mongoose = require("mongoose");

const DocInfoSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.Types.ObjectId,
      ref: "Office",
      required: true,
    },
    to: {
      type: mongoose.Types.ObjectId,
      ref: "Office",
      requireed: true,
    },
    downloadLink: {
      type: String,
    },
    interaction: {
      type: mongoose.Types.ObjectId,
      ref: "Interaction",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DocInfo", DocInfoSchema);
