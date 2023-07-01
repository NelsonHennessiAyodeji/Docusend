const mongoose = require("mongoose");

const db = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Database was successfully connected");
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = db;
