const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./routes/userRoutes');
const makeConnection = require('./connection');

//defining the port.
const PORT = 1244;

//Starting the app at the port, url : /localhost:1234/
app.listen(PORT, console.log("Server has strated at PORT :" + PORT));

//Connecting the app to Mongodb database.
makeConnection();

// Defining body parsing for transervering json form data,
app.use(bodyParser.json());

//Sending the request to userRoutes.
app.use('/api', userRoutes);

module.exports = app;