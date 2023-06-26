//Global Imports
require('dotenv');

//Server Runner inports
const express = require('express');
const server = express();

const port = process.env.PORT || 3000;

//Pseudo Home page
server.get('/', (req, res) => {
    res.status(200).json("Docusend Homepage");
});

server.listen(port, () => {
    console.log(`Server listening on ${port}`);
});