//Global Imports
require("dotenv").config();
require("express-async-errors");

//Server Runner inports
const express = require("express");
const server = express();
const db = require("./database/connectDB");

//File Upload And Download Imports
const fileSystem = require("fs");
const https = require("https");
const path = require("path");

//Other imports
const cookieParser = require("cookie-parser");
const fileUpload = require("multer");
// const fileUpload = require("express-fileupload");

//Router Imports
const authRouter = require("./routers/authRouter");
const officeRouter = require("./routers/officeRouter");

//Error-Handler Imports
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const multer = require("multer");

//Middleware
server.use(express.json());
server.use(cookieParser(process.env.JWT_SECRET));
server.use(express.static("./public"));
// server.use(fileUpload());

// server.post("/upload", function (req, res) {
//   // When a file has been uploaded
//   if (req.files && Object.keys(req.files).length !== 0) {
//     // Uploaded path
//     const uploadedFile = req.files.uploadFile;

//     // Logging uploading file
//     console.log(uploadedFile);

//     // Upload path
//     const uploadPath = __dirname + "/uploads/" + uploadedFile.name;

//     // To save the file using mv() function
//     uploadedFile.mv(uploadPath, function (err) {
//       if (err) {
//         console.log(err);
//         res.send("Failed !!");
//       } else res.send("Successfully Uploaded !!");
//     });
//   } else res.send("No file uploaded !!");
// });

// server.get("/download", function (req, res) {
//   // The res.download() talking file path to be downloaded
//   res.download(__dirname + "/download_gfg.txt", function (err) {
//     if (err) {
//       console.log(err);
//     }
//   });
// });

const downloadFile = (url) => {
  try {
    const fileName = path.basename(url);
    console.log(url);

    const fileStream = fileSystem.createWriteStream(fileName);
    // res.pipe(fileStream);

    //Catch the finish event
    fileStream.on("finish", () => {
      fileStream.close();
      console.log("Donwload completed successfully");
    });
  } catch (error) {
    console.error(error);
  }
};

server.get("/download", (req, res) => {
  try {
    // console.log(req.params.id);
    downloadFile("Something.txt");
    res.json("Download seuccess");
  } catch (error) {
    console.error(error);
  }
});

const port = process.env.PORT || 3000;

//Server Routers
server.use("/api/v1/auth", authRouter);
server.use("/api/v1/offices", officeRouter);

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
    console.log(error.message);
  }
};

start();
