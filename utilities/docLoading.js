const upload = () => {
  if (req.files && Object.keys(req.files).length !== 0) {
    const { uploadFile: uploadedFile } = req.files;
    console.log(uploadedFile);
    const uploadPath = __dirname + "/uploads/" + uploadedFile.name;
    uploadedFile.mv(uploadPath, function (err) {
      if (err) {
        console.log(err);
        res.send("Failed !!");
      } else res.send("Successfully Uploaded !!");
    });
  } else {
    res.send("No file uploaded !!");
  }
};

// server.get("/download", function (req, res) {
//   // The res.download() talking file path to be downloaded
//   res.download(__dirname + "/download_gfg.txt", function (err) {
//     if (err) {
//       console.log(err);
//     }
//   });
// });

module.exports = { upload };
