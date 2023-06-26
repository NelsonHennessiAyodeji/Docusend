//Global Imports
require('dotenv').config();

//Server Runner inports
const express = require('express');
const server = express();
const db = require('./database/connectDB');

const port = process.env.PORT || 3000;

//Pseudo Home page
server.get('/', (req, res) => {
    res.status(200).json("Docusend Homepage");
});

const start = async() => {
    try {
        await db(process.env.MONGO_URI);
        server.listen(port, () => {
            console.log(`Server listening on ${port}`);
        });
    } catch (error) {
        console.log(error.message);
    }
};

start();