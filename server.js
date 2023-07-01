//Global Imports
require("dotenv").config();
require("express-async-errors");

//Server Runner inports
const express = require("express");
const server = express();
const db = require("./database/connectDB");

//Other imports
const cookieParser = require("cookie-parser");
// // const fileUpload = require("express-fileupload");

//Router Imports
const authRouter = require("./routers/authRouter");
const officeRouter = require("./routers/officeRouter");
const documentRouter = require("./routers/documentRouter");

//Error-Handler Imports
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

//Middleware
server.use(express.json());
server.use(cookieParser(process.env.JWT_SECRET));
server.use(express.static("./public"));
// server.use(fileUpload());

const port = process.env.PORT || 3000;

//Server Routers
server.use("/api/v1/auth", authRouter);
server.use("/api/v1/offices", officeRouter);
server.use("/api/v1/interactions", documentRouter);

//Pseudo Home page
server.get("/", (req, res) => {
  res
    .status(200)
    .json({ HomePage: "Docusend Homepage", cookie: req.signedCookies });
});

//Error-Handlers
server.use(notFound);
server.use(errorHandler);

const start = async () => {
  try {
    await db(process.env.MONGO_URI);
    server.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (error) {
    console.error(error.message);
  }
};

start();
