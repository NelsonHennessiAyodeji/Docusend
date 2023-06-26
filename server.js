//Global Imports
require('dotenv').config();
require('express-async-errors');

//Server Runner inports
const express = require('express');
const server = express();
const db = require('./database/connectDB');


//Router Imports
const authRouter = require('./routers/authRouter');

//Error-Handler Imports
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');


//Middleware 
server.use(express.json());

const port = process.env.PORT || 3000;

//Server Routers
server.use('/api/v1/auth', authRouter);

//Pseudo Home page
server.get('/', (req, res) => {
    res.status(200).json("Docusend Homepage");
});

//Error-Handlers
server.use(notFound);
server.use(errorHandler);

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